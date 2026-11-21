import { t } from '@lingui/macro';
import { Coding, ImagingStudy, Patient } from 'fhir/r4b';

import { formatHumanDate } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';

import { RemoteImagingStudy, StoredImagingStudy, VersionedImagingStudy } from './types';

export const DICOM_UID_SYSTEM = 'urn:dicom:uid';
const DICOM_MODALITY_SYSTEM = 'http://dicom.nema.org/resources/ontology/DCM';

export const DEFAULT_MANAGED_BY: Coding = { system: 'urn:fhir-imaging/managed-by', code: 'imaging' };

export function readStudyInstanceUid(study: ImagingStudy): string | undefined {
    return study.identifier?.find(({ system }) => system === DICOM_UID_SYSTEM)?.value?.replace(/^urn:oid:/, '');
}

export function readDicomPatient(study: ImagingStudy): Patient | undefined {
    return study.contained?.find((resource): resource is Patient => resource.resourceType === 'Patient');
}

export function readAccessionNumber(study: ImagingStudy | undefined): string | undefined {
    return study?.identifier?.find(({ type }) => type?.coding?.some(({ code }) => code === 'ACSN'))?.value;
}

export function isManagedBy(study: ImagingStudy, managedBy: Coding) {
    return !!study.meta?.tag?.some(({ system, code }) => system === managedBy.system && code === managedBy.code);
}

export function isStoredImagingStudy(study: ImagingStudy): study is StoredImagingStudy {
    return typeof study.id === 'string' && study.id.length > 0;
}

export function isRemoteImagingStudy(study: ImagingStudy): study is RemoteImagingStudy {
    return study.id === undefined && study.meta === undefined;
}

export function canDetachStudy(study: ImagingStudy, managedBy: Coding): study is VersionedImagingStudy {
    return isStoredImagingStudy(study) && !!study.meta?.versionId && isManagedBy(study, managedBy);
}

export function canAttachStudy(study: RemoteImagingStudy, owner: 'this-patient' | 'other-patient' | undefined) {
    return !!readStudyInstanceUid(study) && owner === undefined;
}

export function formatAttachTitle(label: string, patient: Patient): string {
    const name = patient.name?.[0] ? renderHumanName(patient.name[0]) : undefined;
    const details = [name, formatHumanDate(patient.birthDate)].filter(Boolean).join(', ');
    const target = details || (patient.id && t`ID ${patient.id}`);

    return target ? `${label} — ${target}` : label;
}

export function hasBirthDateMismatch(patient: Patient, study: ImagingStudy): boolean {
    const deviceBirthDate = readDicomPatient(study)?.birthDate;

    return !!patient.birthDate && !!deviceBirthDate && patient.birthDate !== deviceBirthDate;
}

export function formatModality(study: ImagingStudy): string | undefined {
    const names = study.modality?.map(formatModalityCoding).filter(Boolean);

    return names?.length ? [...new Set(names)].join(', ') : undefined;
}

export const MODALITY_FILTER_VALUES = ['US', 'CT', 'MR', 'CR,DX', 'MG', 'PT', 'NM', 'XA', 'RF', 'ES', 'OT'];

export function formatModalityCode(code: string): string {
    return formatModalityCoding({ system: DICOM_MODALITY_SYSTEM, code }) ?? code;
}

function formatModalityCoding(coding: Coding): string | undefined {
    const name = coding.system === DICOM_MODALITY_SYSTEM && coding.code ? nameDicomModality(coding.code) : undefined;

    return name ?? coding.display ?? coding.code;
}

function nameDicomModality(code: string): string | undefined {
    const names: Record<string, string> = {
        US: t`Ultrasound`,
        CT: t`CT`,
        MR: t`MRI`,
        CR: t`X-ray`,
        DX: t`X-ray`,
        MG: t`Mammography`,
        PT: t`PET`,
        NM: t`Nuclear medicine`,
        XA: t`Angiography`,
        RF: t`Fluoroscopy`,
        ES: t`Endoscopy`,
        OT: t`Other`,
    };

    return names[code];
}
