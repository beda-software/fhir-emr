import type { ColumnType } from 'antd/es/table/interface';
import { Coding, Encounter, ImagingStudy, Meta, Patient } from 'fhir/r4b';

import { RecordType } from 'src/uberComponents/ResourceListPage/types';

export type RemoteImagingStudy = Omit<ImagingStudy, 'id' | 'meta'> & { id?: never; meta?: never };
export type StoredImagingStudy = ImagingStudy & { id: string };
export type VersionedImagingStudy = StoredImagingStudy & { meta: Meta & { versionId: string } };

export type DicomSearchField =
    | 'PatientID'
    | 'PatientName'
    | 'ModalitiesInStudy'
    | 'StudyDate'
    | 'AccessionNumber'
    | 'PatientBirthDate'
    | 'StudyInstanceUID'
    | 'StudyDescription'
    | 'ReferringPhysicianName'
    | 'StudyID';

export type DicomQueryParams = Partial<Record<DicomSearchField, string>>;

export interface DicomSearchOptions {
    fields?: DicomSearchField[];
    defaultQueryParams?: DicomQueryParams;
    fixedQueryParams?: Omit<DicomQueryParams, 'ModalitiesInStudy'>;
    defaultDateRangeDays?: number;
    hint?: string;
    emptyText?: string;
}

export interface DicomSearch extends Omit<DicomSearchOptions, 'fields' | 'fixedQueryParams'> {
    fields: DicomSearchField[];
    fixedQueryParams: DicomQueryParams;
}

export type ImagingColumnKey = 'started' | 'modality' | 'series' | 'images' | 'attachedOn';

export type ImagingColumn = ColumnType<RecordType<ImagingStudy>>;

export interface PatientImagingProps {
    patient: Patient;
    encounter?: Encounter;
    modalities?: string[];
    columns?: Array<ImagingColumnKey | ImagingColumn>;
    dicomSearch?: DicomSearchOptions;
    attachLabel?: string;
    emptyText?: string;
    managedBy?: Coding;
    canAttach?: boolean;
    canDetach?: boolean;
}
