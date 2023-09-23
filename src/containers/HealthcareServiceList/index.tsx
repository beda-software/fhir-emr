import { t, Trans } from '@lingui/macro';
import { Col, Empty, Row, Table } from 'antd';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { ModalNewHealthcareService } from 'src/components/ModalNewHealthcareService';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { SpinIndicator } from 'src/components/Spinner';
import { Title } from 'src/components/Typography';

import { useHealthcareServiceList } from './hooks';

export function HealthcareServiceList() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: [
            {
                id: 'service',
                type: 'string',
                placeholder: t`Search by name`,
            },
        ],
    });

    const { healthcareServiceResponse, pagination, pagerManager, handleTableChange } = useHealthcareServiceList(
        columnsFilterValues as StringTypeColumnFilterValue[],
    );

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Healthcare Services</Trans>
                        </Title>
                    </Col>
                    <Col>
                        <ModalNewHealthcareService onCreate={pagerManager.reload} />
                    </Col>
                </Row>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <Table
                    pagination={pagination}
                    onChange={handleTableChange}
                    bordered
                    locale={{
                        emptyText: (
                            <>
                                <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </>
                        ),
                    }}
                    dataSource={isSuccess(healthcareServiceResponse) ? healthcareServiceResponse.data : []}
                    columns={[
                        {
                            title: <Trans>Type</Trans>,
                            dataIndex: 'type',
                            key: 'type',
                            width: '20%',
                            render: (_text, resource) => resource.type?.[0]?.text,
                        },
                        {
                            title: <Trans>Comment</Trans>,
                            dataIndex: 'comment',
                            key: 'comment',
                            width: '20%',
                            render: (_text, resource) => resource.comment,
                        },
                        {
                            title: <Trans>Duration (minutes)</Trans>,
                            dataIndex: 'duration',
                            key: 'duration',
                            width: '20%',
                            render: (_text, resource) => {
                                console.log('resource', resource);
                                return resource.duration;
                            },
                        },
                        {
                            title: <Trans>Status</Trans>,
                            dataIndex: 'active',
                            key: 'active',
                            width: '20%',
                            render: (_text, resource) => (resource.active ? 'Active' : 'Inactive'),
                        },
                    ]}
                    loading={isLoading(healthcareServiceResponse) && { indicator: SpinIndicator }}
                />
            </BasePageContent>
        </>
    );
}
