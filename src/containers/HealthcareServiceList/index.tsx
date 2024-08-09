import { Trans } from '@lingui/macro';
import { Col, Empty, Row, Table } from 'antd';

import { isLoading, isSuccess } from '@beda.software/remote-data';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { ModalChangeActiveHealthcareService } from 'src/components/ModalChangeActiveHealthcareService';
import { ModalEditHealthcareService } from 'src/components/ModalEditHealthcareService';
import { ModalNewHealthcareService } from 'src/components/ModalNewHealthcareService';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { SpinIndicator } from 'src/components/Spinner';
import { Title } from 'src/components/Typography';

import { useHealthcareServiceList } from './hooks';
import { getHealthcareServiceListSearchBarColumns } from './searchBarUtils';

export function HealthcareServiceList() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: getHealthcareServiceListSearchBarColumns(),
    });

    const { healthcareServiceResponse, pagination, pagerManager, handleTableChange } =
        useHealthcareServiceList(columnsFilterValues);

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
                            render: (_text, resource) => resource.name,
                        },
                        {
                            title: <Trans>Duration (minutes)</Trans>,
                            dataIndex: 'duration',
                            key: 'duration',
                            width: '20%',
                            render: (_text, resource) =>
                                resource.extension?.find(
                                    (extension) => extension.url === 'urn:extensions:healthcare-service-duration',
                                )?.valueInteger,
                        },
                        {
                            title: <Trans>Status</Trans>,
                            dataIndex: 'active',
                            key: 'active',
                            width: '20%',
                            render: (_text, resource) => (resource.active ? 'Active' : 'Inactive'),
                        },
                        {
                            title: <Trans>Actions</Trans>,
                            dataIndex: 'actions',
                            key: 'actions',
                            width: '20%',
                            render: (_text, resource) => (
                                <Row>
                                    <Col>
                                        <ModalEditHealthcareService
                                            onSuccess={pagerManager.reload}
                                            healthcareService={resource}
                                        />
                                    </Col>
                                    <Col>
                                        <ModalChangeActiveHealthcareService
                                            onSuccess={pagerManager.reload}
                                            healthcareService={resource}
                                        />
                                    </Col>
                                </Row>
                            ),
                        },
                    ]}
                    loading={isLoading(healthcareServiceResponse) && { indicator: SpinIndicator }}
                />
            </BasePageContent>
        </>
    );
}
