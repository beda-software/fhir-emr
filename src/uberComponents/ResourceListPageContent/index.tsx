import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { Bundle, Resource } from 'fhir/r4b';
import React, { useMemo } from 'react';

import { formatError } from '@beda.software/fhir-react';
import { isFailure, isLoading, isSuccess } from '@beda.software/remote-data';

import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { isTableFilter } from 'src/components/SearchBar/utils';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { populateTableColumnsWithFiltersAndSorts } from 'src/components/Table/utils';

import { HeaderQuestionnaireAction } from '../ResourceListPage/actions';
import { useResourceListPage } from '../ResourceListPage/hooks';
import { BatchActions } from '../ResourceListPage/BatchActions';
import { getRecordActionsColumn, ResourceListPageProps, ResourcesListPageReport } from '../ResourceListPage';
import { PageContainerContent } from 'src/components/BaseLayout/PageContainer/PageContainerContent';
import { S } from './styles';

type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

type ResourceListPageContentProps<R extends Resource> = Omit<ResourceListPageProps<R>, 'headerTitle' | 'maxWidth'> & {};

export function ResourceListPageContent<R extends Resource>({
    resourceType,
    extractPrimaryResources,
    searchParams,
    getRecordActions,
    getHeaderActions,
    getBatchActions,
    getFilters,
    getTableColumns,
    defaultLaunchContext,
    getReportColumns,
}: ResourceListPageContentProps<R>) {
    const allFilters = getFilters?.() ?? [];

    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: allFilters ?? [],
    });
    const tableFilterValues = useMemo(
        () => columnsFilterValues.filter((filter) => isTableFilter(filter)),
        [JSON.stringify(columnsFilterValues)],
    );

    const {
        recordResponse,
        reload,
        pagination,
        handleTableChange,
        selectedRowKeys,
        setSelectedRowKeys,
        selectedResourcesBundle,
    } = useResourceListPage(resourceType, extractPrimaryResources, columnsFilterValues, searchParams ?? {});

    // TODO: move to hooks
    const initialTableColumns = getTableColumns({ reload });
    const tableColumns = populateTableColumnsWithFiltersAndSorts({
        tableColumns: initialTableColumns,
        filters: tableFilterValues,
        onChange: onChangeColumnFilter,
    });
    const headerActions = getHeaderActions?.() ?? [];
    const batchActions = getBatchActions?.() ?? [];

    const renderHeader = () => {
        const hasFilters = columnsFilterValues.length > 0;

        if (!hasFilters && headerActions.length === 0) {
            return null;
        }

        return (
            <S.Header>
                <S.HeaderLeftColumn>
                    {columnsFilterValues.length ? (
                        <SearchBar
                            columnsFilterValues={columnsFilterValues}
                            onChangeColumnFilter={onChangeColumnFilter}
                            onResetFilters={onResetFilters}
                            level={2}
                        />
                    ) : null}
                </S.HeaderLeftColumn>
                <S.HeaderRightColumn $hasFilters={hasFilters}>
                    {headerActions.map((action, index) => (
                        <React.Fragment key={index}>
                            <HeaderQuestionnaireAction
                                action={action}
                                reload={reload}
                                defaultLaunchContext={defaultLaunchContext ?? []}
                            />
                        </React.Fragment>
                    ))}
                </S.HeaderRightColumn>
            </S.Header>
        );
    };

    return (
        <PageContainerContent level={2}>
            {renderHeader()}

            {getReportColumns ? (
                <ResourcesListPageReport recordResponse={recordResponse} getReportColumns={getReportColumns} />
            ) : null}

            {batchActions.length ? (
                <BatchActions
                    batchActions={batchActions}
                    selectedRowKeys={selectedRowKeys}
                    allKeys={isSuccess(recordResponse) ? recordResponse.data.map((d) => d.resource.id!) : []}
                    setSelectedRowKeys={setSelectedRowKeys}
                    reload={reload}
                    selectedResourcesBundle={selectedResourcesBundle}
                    defaultLaunchContext={defaultLaunchContext}
                />
            ) : null}

            <Table<RecordType<R>>
                pagination={pagination}
                onChange={handleTableChange}
                rowSelection={batchActions.length ? { selectedRowKeys, onChange: setSelectedRowKeys } : undefined}
                locale={{
                    emptyText: isFailure(recordResponse) ? (
                        <>
                            <Empty
                                description={formatError(recordResponse.error)}
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </>
                    ) : (
                        <>
                            <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </>
                    ),
                }}
                rowKey={(p) => p.resource.id!}
                dataSource={isSuccess(recordResponse) ? recordResponse.data : []}
                columns={[
                    ...tableColumns,
                    ...(getRecordActions
                        ? [
                              getRecordActionsColumn({
                                  getRecordActions,
                                  reload,
                                  defaultLaunchContext: defaultLaunchContext ?? [],
                              }),
                          ]
                        : []),
                ]}
                loading={isLoading(recordResponse) && { indicator: SpinIndicator }}
            />
        </PageContainerContent>
    );
}
