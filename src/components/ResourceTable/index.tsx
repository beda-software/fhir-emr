import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { Provenance, Resource } from 'fhir/r4b';

import { RenderRemoteData, extractBundleResources, ResourcesMap } from '@beda.software/fhir-react';

import { useResourceTable } from 'src/components/ResourceTable/hooks';
import { GetTableColumns, ResourceTableProps } from 'src/components/ResourceTable/types';
import { Spinner } from 'src/components/Spinner';
import { Table } from 'src/components/Table';

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
