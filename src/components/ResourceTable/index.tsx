import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Provenance, Resource } from 'fhir/r4b';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fromFHIRReference } from 'sdc-qrf';

import { RenderRemoteData, SearchParams, extractBundleResources, ResourcesMap } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { usePagerExtended } from 'src/hooks/pager';

type GetTableColumns<R> = (provenanceList: Provenance[]) => ColumnsType<R>;

export interface Option {
    value: string;
    label: string;
    renderTable: (option: Option) => ReactNode;
    getTableColumns: GetTableColumns<Resource>;
}

interface ResourceTableHookProps<R extends Resource> {
    resourceType: R['resourceType'];
    params?: SearchParams;
}

interface ResourceTableProps<R extends Resource> extends ResourceTableHookProps<R> {
    getTableColumns: GetTableColumns<Resource>;
}

export function useResourceTable<R extends Resource>(props: ResourceTableHookProps<R>) {
    const { resourceType, params = {} } = props;
    const queryParameters = {
        _sort: '-_lastUpdated',
        ...params,
    };

    const {
        resourceResponse: response,
        handleTableChange,
        pagination,
    } = usePagerExtended<R | Provenance>(resourceType, queryParameters);

    return { response, pagination, handleTableChange };
}

export function ResourceTable<R extends Resource>(props: ResourceTableProps<R>) {
    const { resourceType, getTableColumns } = props;
    const { response, pagination, handleTableChange } = useResourceTable<R>(props);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(bundle) => {
                const resources = extractBundleResources(bundle)[resourceType] as R[];
                const provenanceList: Array<Provenance> =
                    (extractBundleResources(bundle) as ResourcesMap<Provenance>).Provenance ?? [];

                return (
                    <Table<R>
                        pagination={pagination}
                        onChange={handleTableChange}
                        locale={{
                            emptyText: (
                                <>
                                    <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </>
                            ),
                        }}
                        rowKey={(r) => r.id!}
                        dataSource={resources}
                        columns={(getTableColumns as unknown as GetTableColumns<R>)(provenanceList)}
                    />
                );
            }}
        </RenderRemoteData>
    );
}

export function LinkToEdit(props: { name?: string; resource: Resource; provenanceList: Provenance[] }) {
    const { name, resource, provenanceList } = props;
    const location = useLocation();
    const provenance = provenanceList.find(
        (p) =>
            fromFHIRReference(p.target[0])?.id === resource.id &&
            fromFHIRReference(p.target[0])?.resourceType === resource.resourceType,
    );
    const entity = provenance?.entity?.[0]?.what;
    const qrId = fromFHIRReference(entity)?.id;
    const pathname = location.pathname.split('/').slice(0, 3).join('/');

    if (qrId) {
        return <Link to={`${pathname}/documents/${qrId}`}>{name}</Link>;
    }

    return <>{name}</>;
}
