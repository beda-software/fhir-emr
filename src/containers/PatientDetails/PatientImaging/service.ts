import { Bundle, Coding, Encounter, ImagingStudy, OperationOutcome, Parameters, Patient } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';
import { failure, isSuccess, mapFailure, mapSuccess, RemoteDataResult, success } from '@beda.software/remote-data';

import { service } from 'src/services/fhir';

import { DICOM_UID_SYSTEM, isRemoteImagingStudy, readStudyInstanceUid } from './study';
import { DicomQueryParams, RemoteImagingStudy, StoredImagingStudy, VersionedImagingStudy } from './types';

// fhir-imaging's operations through the FHIR base: the only module that knows its protocol. Remote search
// results hold Identifying Data: keep them in component state only, never in storage or logs.
//
// A failure is fhir-imaging's diagnostics text, or undefined when it gave none.
type ImagingResult<T> = Promise<RemoteDataResult<T, string | undefined>>;

const MAX_DETAILS_MATCHES = 10;

// Whose an attached exam is, by UID. An exam attached to any Patient can't be picked.
export type AttachmentOwner = 'this-patient' | 'other-patient';

export interface StudySearchResult {
    studies: RemoteImagingStudy[];
    total: number;
    owners: Map<string, AttachmentOwner>;
}

// Remote search, paged, with the studies this installation already attached to this or another Patient
// marked. Associations other systems made don't count. The results hold Identifying Data: never store or log them.
export async function searchImagingStudies(
    query: DicomQueryParams,
    { page, pageSize }: { page: number; pageSize: number },
    patient: Patient,
    managedBy: Coding,
): ImagingResult<StudySearchResult> {
    const response = await searchDicom(query, pageSize, (page - 1) * pageSize);
    if (!isSuccess(response)) {
        return response;
    }
    const { studies, total } = response.data;
    const uids = studies.map(readStudyInstanceUid).filter((uid): uid is string => !!uid);
    const associations = uids.length ? await fetchAssociations(uids, managedBy) : success([]);

    return mapSuccess(associations, (found) => ({ studies, total, owners: buildAttachmentOwners(found, patient) }));
}

// The Studies on the Imaging Server with the Association's UID. Several match when a Study was re-sent after
// a PatientID correction; none without a UID.
export async function findImagingStudies(
    association: StoredImagingStudy,
): ImagingResult<{ studies: RemoteImagingStudy[]; total: number }> {
    const uid = readStudyInstanceUid(association);
    if (!uid) {
        return success({ studies: [], total: 0 });
    }

    return searchDicom({ StudyInstanceUID: uid }, MAX_DETAILS_MATCHES, 0);
}

export async function attachImagingStudy(
    study: RemoteImagingStudy,
    patient: Patient,
    encounter?: Encounter,
): ImagingResult<StoredImagingStudy> {
    const uid = readStudyInstanceUid(study);
    if (!uid) {
        return failure(undefined);
    }

    return withMessage(
        await service<StoredImagingStudy, OperationOutcome>({
            method: 'POST',
            url: '/ImagingStudy/$attach',
            data: {
                resourceType: 'Parameters',
                parameter: [
                    { name: 'studyInstanceUid', valueString: uid },
                    { name: 'patient', valueReference: { reference: `Patient/${patient.id}` } },
                    ...(encounter
                        ? [{ name: 'encounter', valueReference: { reference: `Encounter/${encounter.id}` } }]
                        : []),
                ],
            },
        }),
    );
}

export async function fetchImagingStudyViewerUrl(study: StoredImagingStudy): ImagingResult<string> {
    const response = withMessage(
        await service<Parameters, OperationOutcome>({
            method: 'GET',
            url: `/ImagingStudy/${study.id}/$viewer-url`,
        }),
    );
    if (!isSuccess(response)) {
        return response;
    }
    const url = response.data.parameter?.find(({ name }) => name === 'url')?.valueUrl;

    return url ? success(url) : failure(undefined);
}

// Conditional delete of a Managed Association at the version the user saw: fails with 412 when it has
// changed, is gone or isn't managed by this installation.
export async function detachImagingStudy(
    study: VersionedImagingStudy,
    managedBy: Coding,
): ImagingResult<StoredImagingStudy> {
    return withMessage(
        await service<StoredImagingStudy, OperationOutcome>({
            method: 'DELETE',
            url: '/ImagingStudy',
            params: { _id: study.id, _tag: formatTag(managedBy) },
            headers: { 'If-Match': `W/"${study.meta?.versionId}"` },
        }),
    );
}

async function searchDicom(
    query: DicomQueryParams,
    limit: number,
    offset: number,
): ImagingResult<{ studies: RemoteImagingStudy[]; total: number }> {
    const response = withMessage(
        await service<Bundle<ImagingStudy>, OperationOutcome>({
            method: 'GET',
            url: '/ImagingStudy/$search-dicom',
            params: { ...query, limit, offset },
        }),
    );

    if (!isSuccess(response)) {
        return response;
    }
    const studies = (response.data.entry ?? []).flatMap(({ resource }) => (resource ? [resource] : []));
    if (!studies.every(isRemoteImagingStudy)) {
        return failure(undefined);
    }
    return success({ studies, total: response.data.total ?? studies.length });
}

// This installation's Associations of `uids`, for every Patient. The picker disables studies attached to any.
async function fetchAssociations(uids: string[], managedBy: Coding) {
    const response = await service<Bundle<ImagingStudy>, OperationOutcome>({
        method: 'GET',
        url: '/ImagingStudy',
        params: {
            identifier: uids.map((uid) => `${DICOM_UID_SYSTEM}|urn:oid:${uid}`).join(','),
            _tag: formatTag(managedBy),
            _elements: 'identifier,subject',
            _count: 100,
        },
    });

    return mapSuccess(withMessage(response), (bundle) => extractBundleResources(bundle).ImagingStudy ?? []);
}

function buildAttachmentOwners(associations: ImagingStudy[], patient: Patient): Map<string, AttachmentOwner> {
    const owners = new Map<string, AttachmentOwner>();
    for (const association of associations) {
        const uid = readStudyInstanceUid(association);
        if (uid && owners.get(uid) !== 'this-patient') {
            owners.set(
                uid,
                association.subject?.reference === `Patient/${patient.id}` ? 'this-patient' : 'other-patient',
            );
        }
    }

    return owners;
}

function formatTag({ system, code }: Coding) {
    return `${system}|${code}`;
}

function withMessage<T>(response: RemoteDataResult<T, OperationOutcome | unknown>) {
    return mapFailure(response, (outcome) => (outcome as OperationOutcome | undefined)?.issue?.[0]?.diagnostics);
}
