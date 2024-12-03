import { plural, Trans } from '@lingui/macro';
import { Empty, Row, Col, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Bundle, Resource } from 'fhir/r4b';

import { formatError, SearchParams } from '@beda.software/fhir-react';
import { isFailure, isLoading, isSuccess } from '@beda.software/remote-data';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { Title, Text } from 'src/components/Typography';

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
} from './actions';
export { navigationAction, customAction, questionnaireAction } from './actions';
import { useResourceListPage } from './hooks';
import { SearchBarColumn } from '../../components/SearchBar/types';

type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

interface ResourceListPageProps<R extends Resource> {
    /* Page header title (for example, Organizations) */
    headerTitle: string;

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

    /* Search bar columns that displayed before the table */
    searchBarColumns?: SearchBarColumn[];

    /* Table columns without action column - action column is generated based on `getRecordActions` */
    tableColumns: ColumnsType<RecordType<R>>;

    /**
     * Record actions list that is displayed in the table per record
     * (for example, edit organization)
     */
    getRecordActions?: (
        record: RecordType<R>,
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
}

export function ResourceListPage<R extends Resource>({
    headerTitle: title,
    resourceType,
    extractPrimaryResources,
    searchParams,
    getRecordActions,
    getHeaderActions,
    getBatchActions,
    searchBarColumns,
    tableColumns,
}: ResourceListPageProps<R>) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: searchBarColumns ?? [],
    });

    const {
        recordResponse,
        pagerManager,
        pagination,
        handleTableChange,
        selectedRowKeys,
        setSelectedRowKeys,
        selectedResourcesBundle,
    } = useResourceListPage(resourceType, extractPrimaryResources, columnsFilterValues, searchParams ?? {});

    const headerActions = getHeaderActions?.() ?? [];
    const batchActions = getBatchActions?.() ?? [];

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>{title}</Title>
                    </Col>
                    {headerActions.map((action, index) => (
                        <Col key={index}>
                            <HeaderQuestionnaireAction action={action} reload={pagerManager.reload} />
                        </Col>
                    ))}
                </Row>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                {batchActions.length ? (
                    <Row justify="start" align="middle" gutter={[8, 16]}>
                        {batchActions.map((action, index) => (
                            <Col key={index}>
                                <BatchQuestionnaireAction<R>
                                    action={action}
                                    reload={pagerManager.reload}
                                    bundle={selectedResourcesBundle}
                                    disabled={!selectedRowKeys.length}
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
                            ? [getRecordActionsColumn({ getRecordActions, reload: pagerManager.reload })]
                            : []),
                    ]}
                    loading={isLoading(recordResponse) && { indicator: SpinIndicator }}
                />
            </BasePageContent>
        </>
    );
}

function getRecordActionsColumn<R extends Resource>({
    getRecordActions,
    reload,
}: {
    getRecordActions: (
        record: RecordType<R>,
    ) => Array<QuestionnaireActionType | NavigationActionType | CustomActionType>;
    reload: () => void;
}) {
    return {
        title: <Trans>Actions</Trans>,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text: any, record: { resource: R; bundle: Bundle }) => {
            return (
                <Row wrap={false}>
                    {getRecordActions(record).map((action, index) => (
                        <Col key={index}>
                            {isQuestionnaireAction(action) ? (
                                <RecordQuestionnaireAction action={action} reload={reload} resource={record.resource} />
                            ) : isNavigationAction(action) ? (
                                <NavigationAction action={action} resource={record.resource} />
                            ) : (
                                action.title
                            )}
                        </Col>
                    ))}
                </Row>
            );
        },
    };
}
