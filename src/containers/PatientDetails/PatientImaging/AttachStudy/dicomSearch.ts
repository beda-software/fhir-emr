import moment from 'moment';

import { DicomQueryParams, DicomSearch, DicomSearchField, DicomSearchOptions } from '../types';

const DICOM_DATE_FORMAT = 'YYYYMMDD';

export const DEFAULT_DICOM_SEARCH_FIELDS: DicomSearchField[] = [
    'PatientID',
    'PatientName',
    'ModalitiesInStudy',
    'StudyDate',
    'AccessionNumber',
];

export function buildDicomSearch(options: DicomSearchOptions, modalities?: string[]): DicomSearch {
    const fixedQueryParams: DicomQueryParams = {
        ...options.fixedQueryParams,
        ...(modalities?.length ? { ModalitiesInStudy: modalities.join(',') } : {}),
    };
    const fields = (options.fields ?? DEFAULT_DICOM_SEARCH_FIELDS).filter((field) => !fixedQueryParams[field]);

    return { ...options, fields, fixedQueryParams };
}

export function buildInitialDicomQuery(options: DicomSearchOptions, today = moment()): DicomQueryParams {
    const days = options.defaultDateRangeDays ?? 14;
    const studyDate = buildDicomDateRange(today.clone().subtract(days + 1, 'days'), today.clone().add(1, 'day'));

    return { StudyDate: studyDate, ...options.defaultQueryParams };
}

export function buildDicomQuery(editable: DicomQueryParams, fixed: DicomQueryParams = {}): DicomQueryParams {
    const name = editable.PatientName?.trim();
    const typed = { ...editable, PatientName: name && !/[*?]/.test(name) ? `${name}*` : name };
    const filled = Object.entries({ ...typed, ...fixed }).filter(([, value]) => value?.trim());

    return Object.fromEntries(filled.map(([name, value]) => [name, value!.trim()]));
}

export function buildDicomDateRange(from: moment.Moment, to: moment.Moment) {
    return `${from.format(DICOM_DATE_FORMAT)}-${to.format(DICOM_DATE_FORMAT)}`;
}

export function parseDicomDateRange(value: string | undefined): [moment.Moment, moment.Moment] | undefined {
    const [from, to] = value?.split('-') ?? [];

    return from && to ? [moment(from, DICOM_DATE_FORMAT), moment(to, DICOM_DATE_FORMAT)] : undefined;
}

export function formatDicomDate(value: moment.Moment) {
    return value.format(DICOM_DATE_FORMAT);
}

export function parseDicomDate(value: string | undefined) {
    return value ? moment(value, DICOM_DATE_FORMAT) : undefined;
}
