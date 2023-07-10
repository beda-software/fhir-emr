import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { SearchParams } from 'fhir-react/lib/services/search';
import { Provenance, Resource } from 'fhir/r4b';
import { ReactNode } from 'react';

import { Spinner } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { usePagerExtended } from 'src/hooks/pager';

export interface Option {
    value: string;
    label: string;
    renderTable: (option: Option) => ReactNode;
    getTableColumns: (provenanceList: Provenance[]) => any;
}

interface ResourceTableProps<R extends Resource> {
    resourceType: R['resourceType'];
    params?: SearchParams;
    option: Option;
}

function useResourceTable<R extends Resource>(props: ResourceTableProps<R>) {
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
    const { resourceType, option } = props;
    const { response, pagination, handleTableChange } = useResourceTable<R>(props);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(bundle) => {
                const resources = extractBundleResources(bundle)[resourceType] as R[];
                const provenanceList = (extractBundleResources(bundle) as any).Provenance || [];

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
                        columns={option.getTableColumns(provenanceList)}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
