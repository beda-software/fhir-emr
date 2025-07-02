import { t, Trans } from '@lingui/macro';
import { Col, Empty, Row } from 'antd';

import { isLoading, isSuccess } from '@beda.software/remote-data';

import { Table } from 'src/components';
import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { ModalChangeActiveHealthcareService } from 'src/components/ModalChangeActiveHealthcareService';
import { ModalEditHealthcareService } from 'src/components/ModalEditHealthcareService';
import { ModalNewHealthcareService } from 'src/components/ModalNewHealthcareService';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { SpinIndicator } from 'src/components/Spinner';

import { useHealthcareServiceList } from './hooks';
import { getHealthcareServiceListSearchBarColumns } from './searchBarUtils';

export function HealthcareServiceList() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: getHealthcareServiceListSearchBarColumns(),
    });

    const { healthcareServiceResponse, pagination, pagerManager, handleTableChange } =
        useHealthcareServiceList(columnsFilterValues);

    return (
        <PageContainer
            layoutVariant="with-table"
            title={<Trans>Healthcare Services</Trans>}
            titleRightElement={<ModalNewHealthcareService onCreate={pagerManager.reload} />}
            headerContent={
                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            }
        >
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
                        render: (_text, resource) => (resource.active ? t`Active` : t`Inactive`),
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
        </PageContainer>
    );
}
