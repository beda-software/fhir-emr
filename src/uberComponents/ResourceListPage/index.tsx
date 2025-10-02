import { ArrowLeftOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';
import React, { useCallback, useMemo } from 'react';

import { formatError } from '@beda.software/fhir-react';
import { isFailure, isLoading, isSuccess, RemoteData } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Report } from 'src/components/Report';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { isTableFilter } from 'src/components/SearchBar/utils';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { populateTableColumnsWithFiltersAndSorts } from 'src/components/Table/utils';
import { Text } from 'src/components/Typography';

import {
    NavigationActionType,
    CustomActionType,
    QuestionnaireActionType,
    isNavigationAction,
    isQuestionnaireAction,
    NavigationAction,
    RecordQuestionnaireAction,
    HeaderNavigationAction,
    HeaderQuestionnaireAction,
    isCustomAction,
    WebExtra,
} from './actions';
export { navigationAction, customAction, questionnaireAction } from './actions';
import { BatchActions } from './BatchActions';
import { useResourceListPage, useTableSorter } from './hooks';
import { S } from './styles';
import { ResourceListProps, ReportColumn, TableManager } from './types';

type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

type ResourceListPageProps<R extends Resource> = ResourceListProps<R, WebExtra> & {
    /* Page header title (for example, Organizations) */
    headerTitle: string;

    /* Should the back button be displayed? */
    backButtonVisible?: boolean;

    /* Page content max width */
    maxWidth?: number | string;

    /* Table columns without action column - action column is generated based on `getRecordActions` */
    getTableColumns: (manager: TableManager) => ColumnsType<RecordType<R>>;
};

export function ResourceListPage<R extends Resource>({
    headerTitle: title,
    backButtonVisible,
    maxWidth,
    resourceType,
    extractPrimaryResources,
    extractChildrenResources,
    searchParams: defaultSearchParams,
    getRecordActions,
    getHeaderActions,
    getBatchActions,
    getFilters,
    getSorters,
    getTableColumns,
    defaultLaunchContext,
    getReportColumns,
}: ResourceListPageProps<R>) {
    const allFilters = getFilters?.() ?? [];
    const allSorters = useMemo(() => getSorters?.() ?? [], [getSorters]);

    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: allFilters ?? [],
    });
    const tableFilterValues = useMemo(
        () => columnsFilterValues.filter((filter) => isTableFilter(filter)),
        [JSON.stringify(columnsFilterValues)],
    );

    const { sortSearchParam, setCurrentSorter, currentSorter } = useTableSorter(allSorters, defaultSearchParams);

    const { recordResponse, reload, pagination, selectedRowKeys, setSelectedRowKeys, selectedResourcesBundle, goBack } =
        useResourceListPage(resourceType, extractPrimaryResources, extractChildrenResources, columnsFilterValues, {
            ...defaultSearchParams,
            _sort: sortSearchParam,
        });

    const handleTableChange = useCallback(
        (
            paginationConfig: TablePaginationConfig,
            _filters: Record<string, FilterValue | null>,
            sorter: SorterResult<RecordType<R>> | SorterResult<RecordType<R>>[],
        ) => {
            if (!Array.isArray(sorter)) {
                setCurrentSorter(sorter as any as SorterResult);
            }
            if (typeof paginationConfig.current !== 'number') {
                return;
            }
            if (paginationConfig.pageSize && paginationConfig.pageSize !== pagination.pageSize) {
                pagination.reload();
                pagination.updatePageSize(paginationConfig.pageSize);
            } else {
                pagination.loadPage(paginationConfig.current, {
                    _page: paginationConfig.current,
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
        sorters: allSorters,
        currentSorter,
        onChange: onChangeColumnFilter,
    });
    const headerActions = getHeaderActions?.() ?? [];
    const batchActions = getBatchActions?.(selectedResourcesBundle) ?? [];

    return (
        <PageContainer
            title={title}
            maxWidth={maxWidth}
            titleLeftElement={backButtonVisible ? <ArrowLeftOutlined onClick={goBack} /> : null}
            titleRightElement={headerActions.map((action, index) => {
                if (isQuestionnaireAction(action)) {
                    return (
                        <React.Fragment key={index}>
                            <HeaderQuestionnaireAction
                                action={action}
                                reload={reload}
                                defaultLaunchContext={defaultLaunchContext ?? []}
                            />
                        </React.Fragment>
                    );
                } else if (isNavigationAction(action)) {
                    return (
                        <React.Fragment key={index}>
                            <HeaderNavigationAction action={action} />
                        </React.Fragment>
                    );
                }
            })}
            headerContent={
                columnsFilterValues.length ? (
                    <SearchBar
                        columnsFilterValues={columnsFilterValues}
                        onChangeColumnFilter={onChangeColumnFilter}
                        onResetFilters={onResetFilters}
                    />
                ) : null
            }
        >
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
                pagination={{ total: pagination.total, pageSize: pagination.pageSize }}
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
        </PageContainer>
    );
}

interface ResourcesListPageReportProps<R> {
    recordResponse: RemoteData<
        {
            resource: R;
            bundle: Bundle;
        }[],
        any
    >;
    getReportColumns: (bundle: Bundle, reportBundle?: Bundle) => Array<ReportColumn>;
}

export function ResourcesListPageReport<R>(props: ResourcesListPageReportProps<R>) {
    const { recordResponse, getReportColumns } = props;
    const emptyBundle: Bundle = { resourceType: 'Bundle', entry: [], type: 'searchset' };
    const items =
        isSuccess(recordResponse) && recordResponse.data?.[0]?.bundle
            ? getReportColumns(recordResponse.data[0].bundle)
            : getReportColumns(emptyBundle);

    return <Report items={items} />;
}

export function getRecordActionsColumn<R extends Resource>({
    getRecordActions,
    defaultLaunchContext,
    reload,
}: {
    getRecordActions: (
        record: RecordType<R>,
        manager: TableManager,
    ) => Array<QuestionnaireActionType | NavigationActionType | CustomActionType>;
    defaultLaunchContext?: ParametersParameter[];
    reload: () => void;
}) {
    return {
        title: <Trans>Actions</Trans>,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text: any, record: { resource: R; bundle: Bundle }) => {
            return (
                <S.Actions>
                    {getRecordActions(record, { reload }).map((action, index) => (
                        <React.Fragment key={index}>
                            {isQuestionnaireAction(action) ? (
                                <RecordQuestionnaireAction
                                    action={action}
                                    reload={reload}
                                    resource={record.resource}
                                    defaultLaunchContext={defaultLaunchContext ?? []}
                                />
                            ) : isNavigationAction(action) ? (
                                <NavigationAction action={action} resource={record.resource} />
                            ) : isCustomAction(action) ? (
                                action.control
                            ) : (
                                <Text>Unsupported action</Text>
                            )}
                        </React.Fragment>
                    ))}
                </S.Actions>
            );
        },
    };
}
