import { AxiosRequestConfig } from 'axios';
import { Bundle, ImagingStudy, OperationOutcome, Patient } from 'fhir/r4b';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { failure, RemoteDataResult, success } from '@beda.software/remote-data';

import { service } from 'src/services/fhir';

import {
    attachImagingStudy,
    detachImagingStudy,
    fetchImagingStudyViewerUrl,
    findImagingStudies,
    searchImagingStudies,
} from './service';
import { RemoteImagingStudy, StoredImagingStudy, VersionedImagingStudy } from './types';

vi.mock('src/services/fhir', async () => {
    const actual = await vi.importActual<typeof import('src/services/fhir')>('src/services/fhir');
    return {
        ...actual,
        service: vi.fn(),
    };
});

const patient: Patient = { resourceType: 'Patient', id: 'p1' };
const managedBy = { system: 'urn:fhir-imaging/managed-by', code: 'measure' };

const study = (uid?: string, fields: Partial<RemoteImagingStudy> = {}): RemoteImagingStudy => ({
    resourceType: 'ImagingStudy',
    status: 'available',
    subject: { reference: 'Patient/p1' },
    ...(uid ? { identifier: [{ system: 'urn:dicom:uid', value: `urn:oid:${uid}` }] } : {}),
    ...fields,
});

const storedStudy = (uid?: string, fields: Partial<StoredImagingStudy> = {}): VersionedImagingStudy => ({
    ...study(uid),
    ...fields,
    id: fields.id ?? 's1',
    meta: { ...fields.meta, versionId: fields.meta?.versionId ?? '1' },
});

const bundle = (studies: ImagingStudy[], total?: number): Bundle<ImagingStudy> => ({
    resourceType: 'Bundle',
    type: 'searchset',
    total,
    entry: studies.map((resource) => ({ resource })),
});

const outcome = (diagnostics: string): OperationOutcome => ({
    resourceType: 'OperationOutcome',
    issue: [{ severity: 'error', code: 'processing', diagnostics }],
});

// fhir-imaging, answering by request URL.
function respond(responses: Record<string, RemoteDataResult<unknown>>) {
    vi.mocked(service).mockImplementation(async (config: AxiosRequestConfig) => {
        const response = responses[config.url!];
        if (!response) {
            throw new Error(`Unexpected request ${config.method} ${config.url}`);
        }

        return response as Awaited<ReturnType<typeof service>>;
    });
}

const requests = () => vi.mocked(service).mock.calls.map(([config]) => config);

beforeEach(() => {
    vi.mocked(service).mockReset();
});

describe('searchImagingStudies', () => {
    it('pages $search-dicom and marks the studies this installation attached to this or another Patient', async () => {
        const found = [study('1.1'), study('1.2'), study('1.3')];
        respond({
            '/ImagingStudy/$search-dicom': success(bundle(found, 23)),
            '/ImagingStudy': success(
                bundle([
                    study('1.1', { subject: { reference: 'Patient/p1' } }),
                    study('1.1', { subject: { reference: 'Patient/p2' } }),
                    study('1.2', { subject: { reference: 'Patient/p2' } }),
                ]),
            ),
        });

        const result = await searchImagingStudies({ PatientID: 'X1' }, { page: 3, pageSize: 10 }, patient, managedBy);

        expect(result).toEqual(
            success({
                studies: found,
                total: 23,
                owners: new Map([
                    ['1.1', 'this-patient'],
                    ['1.2', 'other-patient'],
                ]),
            }),
        );
        expect(requests()).toEqual([
            {
                method: 'GET',
                url: '/ImagingStudy/$search-dicom',
                params: { PatientID: 'X1', limit: 10, offset: 20 },
            },
            {
                method: 'GET',
                url: '/ImagingStudy',
                params: {
                    identifier: 'urn:dicom:uid|urn:oid:1.1,urn:dicom:uid|urn:oid:1.2,urn:dicom:uid|urn:oid:1.3',
                    _tag: 'urn:fhir-imaging/managed-by|measure',
                    _elements: 'identifier,subject',
                    _count: 100,
                },
            },
        ]);
    });

    it('skips the Association lookup when no study has a UID, and counts the page when there is no total', async () => {
        respond({ '/ImagingStudy/$search-dicom': success(bundle([study()])) });

        const result = await searchImagingStudies({}, { page: 1, pageSize: 10 }, patient, managedBy);

        expect(result).toEqual(success({ studies: [study()], total: 1, owners: new Map() }));
        expect(requests()).toHaveLength(1);
    });

    it("fails with fhir-imaging's diagnostics when the search or the Association lookup fails", async () => {
        respond({ '/ImagingStudy/$search-dicom': failure(outcome('Imaging Server unreachable')) });
        expect(await searchImagingStudies({}, { page: 1, pageSize: 10 }, patient, managedBy)).toEqual(
            failure('Imaging Server unreachable'),
        );

        respond({
            '/ImagingStudy/$search-dicom': success(bundle([study('1.1')])),
            '/ImagingStudy': failure(outcome('Forbidden')),
        });
        expect(await searchImagingStudies({}, { page: 1, pageSize: 10 }, patient, managedBy)).toEqual(
            failure('Forbidden'),
        );
    });
});

describe('findImagingStudies', () => {
    it("looks the Association's UID up on the Imaging Server", async () => {
        const found = [study('1.1'), study('1.1', { description: 'Re-sent' })];
        respond({ '/ImagingStudy/$search-dicom': success(bundle(found, 2)) });

        expect(await findImagingStudies(storedStudy('1.1'))).toEqual(success({ studies: found, total: 2 }));
        expect(requests()[0]!.params).toEqual({ StudyInstanceUID: '1.1', limit: 10, offset: 0 });
    });

    it('finds nothing, without a request, for an Association without a UID', async () => {
        expect(await findImagingStudies(storedStudy())).toEqual(success({ studies: [], total: 0 }));
        expect(requests()).toHaveLength(0);
    });
});

describe('attachImagingStudy', () => {
    it("attaches the study's UID to the Patient and Encounter", async () => {
        respond({ '/ImagingStudy/$attach': success(storedStudy('1.1')) });

        await attachImagingStudy(study('1.1'), patient, {
            resourceType: 'Encounter',
            id: 'e1',
            status: 'finished',
            class: {},
        });

        expect(requests()[0]).toEqual({
            method: 'POST',
            url: '/ImagingStudy/$attach',
            data: {
                resourceType: 'Parameters',
                parameter: [
                    { name: 'studyInstanceUid', valueString: '1.1' },
                    { name: 'patient', valueReference: { reference: 'Patient/p1' } },
                    { name: 'encounter', valueReference: { reference: 'Encounter/e1' } },
                ],
            },
        });
    });

    it('fails without a request for a study without a UID', async () => {
        expect((await attachImagingStudy(study(), patient)).status).toBe('Failure');
        expect(requests()).toHaveLength(0);
    });
});

describe('detachImagingStudy', () => {
    it('deletes only the managed Association, at the version the user saw', async () => {
        respond({ '/ImagingStudy': failure(outcome('Precondition failed')) });

        const result = await detachImagingStudy(storedStudy('1.1', { id: 's1', meta: { versionId: '7' } }), managedBy);

        expect(result).toEqual(failure('Precondition failed'));
        expect(requests()[0]).toEqual({
            method: 'DELETE',
            url: '/ImagingStudy',
            params: { _id: 's1', _tag: 'urn:fhir-imaging/managed-by|measure' },
            headers: { 'If-Match': 'W/"7"' },
        });
    });
});

describe('fetchImagingStudyViewerUrl', () => {
    it("returns the Viewer's URL for the study", async () => {
        respond({
            '/ImagingStudy/s1/$viewer-url': success({
                resourceType: 'Parameters',
                parameter: [{ name: 'url', valueUrl: 'http://viewer/1.1' }],
            }),
        });

        expect(await fetchImagingStudyViewerUrl(storedStudy('1.1', { id: 's1' }))).toEqual(
            success('http://viewer/1.1'),
        );
    });

    it('fails when fhir-imaging returns no URL', async () => {
        respond({ '/ImagingStudy/s1/$viewer-url': success({ resourceType: 'Parameters' }) });

        expect((await fetchImagingStudyViewerUrl(storedStudy('1.1', { id: 's1' }))).status).toBe('Failure');
    });
});
