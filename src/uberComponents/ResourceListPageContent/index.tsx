import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { Resource } from 'fhir/r4b';
import React, { useCallback, useMemo } from 'react';

import { formatError } from '@beda.software/fhir-react';
import { isFailure, isLoading, isSuccess } from '@beda.software/remote-data';

import { PageContainerContent } from 'src/components/BaseLayout/PageContainer/PageContainerContent';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { isTableFilter } from 'src/components/SearchBar/utils';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { populateTableColumnsWithFiltersAndSorts } from 'src/components/Table/utils';

import { S } from './styles';
import { getRecordActionsColumn, ResourcesListPageReport } from '../ResourceListPage';
import { HeaderQuestionnaireAction, WebExtra } from '../ResourceListPage/actions';
import { BatchActions } from '../ResourceListPage/BatchActions';
import { useResourceListPage } from '../ResourceListPage/hooks';
import { RecordType, ResourceListProps, TableManager } from '../ResourceListPage/types';

type ResourceListPageContentProps<R extends Resource> = ResourceListProps<R, WebExtra> & {
    getTableColumns: (manager: TableManager) => ColumnsType<RecordType<R>>;
};

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

    const { recordResponse, reload, pagination, selectedRowKeys, setSelectedRowKeys, selectedResourcesBundle } =
        useResourceListPage(resourceType, extractPrimaryResources, columnsFilterValues, searchParams ?? {});

    const handleTableChange = useCallback(
        (event: TablePaginationConfig) => {
            if (typeof event.current !== 'number') {
                return;
            }
            if (event.pageSize && event.pageSize !== pagination.pageSize) {
                pagination.reload();
                pagination.updatePageSize(event.pageSize);
            } else {
                pagination.loadPage(event.current, {
                    _page: event.current,
                });
            }
            setSelectedRowKeys([]);
        },
        [pagination],
    );

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
