import { t } from '@lingui/macro';
import { ImagingStudy } from 'fhir/r4b';

import { formatHumanDate, formatHumanDateTime } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';

import { formatModality, readAccessionNumber, readDicomPatient, readStudyInstanceUid } from './study';

export interface StudyField {
    key: string;
    label: string;
    value: string;
    copyable?: boolean;
}

export function buildStudyFields(association: ImagingStudy, current?: ImagingStudy): StudyField[] {
    return compactFields([
        { key: 'description', label: t`Description`, value: current?.description ?? association.description },
        {
            key: 'started',
            label: t`Date/time`,
            value: formatHumanDateTime(current?.started ?? association.started),
        },
        { key: 'modality', label: t`Type`, value: formatModality(current ?? association) },
        {
            key: 'series',
            label: t`Series`,
            value: formatCount(current?.numberOfSeries ?? association.numberOfSeries),
        },
        {
            key: 'images',
            label: t`Images`,
            value: formatCount(current?.numberOfInstances ?? association.numberOfInstances),
        },
        {
            key: 'accessionNumber',
            label: t`Accession number`,
            value: readAccessionNumber(current) ?? readAccessionNumber(association),
        },
        { key: 'attachedOn', label: t`Attached on`, value: formatHumanDateTime(association.meta?.lastUpdated) },
        {
            key: 'studyInstanceUid',
            label: t`Study Instance UID`,
            value: readStudyInstanceUid(association),
            copyable: true,
        },
    ]);
}

export function buildDeviceFields(current: ImagingStudy): StudyField[] {
    const dicomPatient = readDicomPatient(current);
    const name = dicomPatient?.name?.[0];

    return compactFields([
        { key: 'patientId', label: t`Patient ID`, value: dicomPatient?.identifier?.[0]?.value },
        { key: 'name', label: t`Name`, value: name ? renderHumanName(name) : undefined },
        { key: 'birthDate', label: t`Date of birth`, value: formatHumanDate(dicomPatient?.birthDate) },
        { key: 'referrer', label: t`Referring physician`, value: current.referrer?.display },
    ]);
}

function compactFields(fields: Array<Omit<StudyField, 'value'> & { value?: string }>): StudyField[] {
    return fields.filter((field): field is StudyField => !!field.value);
}

function formatCount(count: number | undefined) {
    return count === undefined ? undefined : String(count);
}
