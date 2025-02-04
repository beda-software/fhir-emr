import { ColumnsType } from 'antd/lib/table';
import { Provenance, Resource } from 'fhir/r4b';
import { ReactNode } from 'react';

import { SearchParams } from '@beda.software/fhir-react';

export type GetTableColumns<R> = (provenanceList: Provenance[]) => ColumnsType<R>;

export interface Option {
    value: string;
    label: string;
    renderTable: (option: Option) => ReactNode;
    getTableColumns: GetTableColumns<Resource>;
}

export interface ResourceTableHookProps<R extends Resource> {
    resourceType: R['resourceType'];
    params?: SearchParams;
}

export interface ResourceTableProps<R extends Resource> extends ResourceTableHookProps<R> {
    getTableColumns: GetTableColumns<Resource>;
}
