import { plural, Trans } from '@lingui/macro';
import { Empty, Row, Col, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';
import React from 'react';

import { formatError, SearchParams } from '@beda.software/fhir-react';
import { isFailure, isLoading, isSuccess } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { Text } from 'src/components/Typography';

import {
    NavigationActionType,
    CustomActionType,
    QuestionnaireActionType,
    isNavigationAction,
    isQuestionnaireAction,
    NavigationAction,
    RecordQuestionnaireAction,
    HeaderQuestionnaireAction,
    BatchQuestionnaireAction,
    isCustomAction,
} from './actions';
export { navigationAction, customAction, questionnaireAction } from './actions';
import { useResourceListPage } from './hooks';
import { SearchBarColumn } from '../../components/SearchBar/types';
import { populateTableColumnsWithFiltersAndSorts } from 'src/components/Table/utils';
import { isTableFilter } from 'src/components/SearchBar/utils';
import { useMemo } from 'react';

type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

interface TableManager {
    reload: () => void;
}

interface ResourceListPageProps<R extends Resource> {
    /* Page header title (for example, Organizations) */
    headerTitle: string;

    /* Page content max width */
    maxWidth?: number | string;

    /* Primary resource type (for example, Organization) */
    resourceType: R['resourceType'];

    /**
     * Custom primary resources extractor, might be used when the same resource type included
     * e.g. Organizations included via part-of
     *
     * Default - extract all resources matching `resourceType`
     */
    extractPrimaryResources?: (bundle: Bundle) => R[];

    /* Default search params */
    searchParams?: SearchParams;

    /* Filter that are displayed in the search bar and inside table columns */
    getFilters?: () => SearchBarColumn[];

    /* Table columns without action column - action column is generated based on `getRecordActions` */
    getTableColumns: (manager: TableManager) => ColumnsType<RecordType<R>>;

    /**
     * Record actions list that is displayed in the table per record
     * (for example, edit organization)
     */
    getRecordActions?: (
        record: RecordType<R>,
        manager: TableManager,
    ) => Array<QuestionnaireActionType | NavigationActionType | CustomActionType>;

    /**
     * Header actions (for example, new organization)
     *
     * NOTE: Theoretically getHeaderActions can accept all resources Bundle
     */
    getHeaderActions?: () => Array<QuestionnaireActionType>;

    /**
     * Batch actions that are available when rows are selected
     * (for example, delete multiple organizations)
     *
     * NOTE: Theoretically getHeaderActions can accept selected resources Bundle
     */
    getBatchActions?: () => Array<QuestionnaireActionType>;

    /**
     * Default launch context that will be added to all questionnaires
     */
    defaultLaunchContext?: ParametersParameter[];
}

export function ResourceListPage<R extends Resource>({
    headerTitle: title,
    maxWidth,
    resourceType,
    extractPrimaryResources,
    searchParams,
    getRecordActions,
    getHeaderActions,
    getBatchActions,
    getFilters,
    getTableColumns,
    defaultLaunchContext,
}: ResourceListPageProps<R>) {
    const allFilters = getFilters?.() ?? [];

    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } =
        useSearchBar({
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

    return (
        <PageContainer
            title={title}
            maxWidth={maxWidth}
            headerRightColumn={headerActions.map((action, index) => (
                <React.Fragment key={index}>
                    <HeaderQuestionnaireAction
                        action={action}
                        reload={reload}
                        defaultLaunchContext={defaultLaunchContext ?? []}
                    />
                </React.Fragment>
            ))}
            header={{
                children: columnsFilterValues.length ? (
                    <SearchBar
                        columnsFilterValues={columnsFilterValues}
                        onChangeColumnFilter={onChangeColumnFilter}
                        onResetFilters={onResetFilters}
                    />
                ) : null,
            }}
        >
            {batchActions.length ? (
                <Row justify="start" align="middle" gutter={[8, 16]}>
                    {batchActions.map((action, index) => (
                        <Col key={index}>
                            <BatchQuestionnaireAction<R>
                                action={action}
                                reload={reload}
                                bundle={selectedResourcesBundle}
                                disabled={!selectedRowKeys.length}
                                defaultLaunchContext={defaultLaunchContext ?? []}
                            />
                        </Col>
                    ))}
                    <Col>
                        {selectedRowKeys.length ? (
                            <Button type="default" onClick={() => setSelectedRowKeys([])}>
                                <Trans>Reset selection</Trans>
                            </Button>
                        ) : null}
                    </Col>
                    <Col>
                        <Text>
                            {selectedRowKeys.length
                                ? plural(selectedRowKeys.length, {
                                      one: 'Selected # item',
                                      other: 'Selected # items',
                                  })
                                : null}
                        </Text>
                    </Col>
                </Row>
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
        </PageContainer>
    );
}

function getRecordActionsColumn<R extends Resource>({
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
                <Row wrap={false}>
                    {getRecordActions(record, { reload }).map((action, index) => (
                        <Col key={index}>
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
                        </Col>
                    ))}
                </Row>
            );
        },
    };
}
