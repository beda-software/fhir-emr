import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button, Col, Empty, Row } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Questionnaire } from 'fhir/r4b';
import { Link } from 'react-router-dom';

import config from '@beda.software/emr-config';
import { isLoading, isSuccess } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';

import { useQuestionnaireList } from './hooks';
import { getQuestionnaireListSearchBarColumns } from './searchBarUtils';

const columns: ColumnsType<Questionnaire> = [
    {
        title: <Trans id="msg.QuestionnaireName">Name</Trans>,
        dataIndex: 'name',
        key: 'name',
        render: (_text, resource) => resource.title || resource.id,
    },

    {
        title: <Trans>Edit in</Trans>,
        width: 500,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, resource) => {
            return (
                <Row wrap={false} align="middle">
                    <Col>
                        <Link to={`/questionnaires/${resource.id}/edit`}>
                            <Button type="link">
                                <Trans>AI builder</Trans>
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <a
                            href={`${config.sdcIdeUrl}/${resource.id}?client=sdc-ide`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            <Trans>SDC IDE</Trans>
                        </a>
                    </Col>
                    <Col>
                        <Link to={`/questionnaires/${resource.id}/aidbox-forms-builder/edit`}>
                            <Button type="link">
                                <Trans>Aidbox Forms Builder</Trans>
                            </Button>
                        </Link>
                    </Col>
                </Row>
            );
        },
    },
];

export function QuestionnaireList() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: getQuestionnaireListSearchBarColumns(),
    });

    const { pagination, questionnaireListRD, handleTableChange } = useQuestionnaireList(columnsFilterValues);

    return (
        <PageContainer
            layoutVariant="with-table"
            title={<Trans>Questionnaires</Trans>}
            titleRightElement={
                <Link to="/questionnaires/builder">
                    <Button icon={<PlusOutlined />} type="primary">
                        <span>
                            <Trans>Add questionnaire</Trans>
                        </span>
                    </Button>
                </Link>
            }
            headerContent={
                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            }
        >
            <Table<Questionnaire>
                pagination={pagination}
                onChange={handleTableChange}
                locale={{
                    emptyText: (
                        <>
                            <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </>
                    ),
                }}
                rowKey={(p) => p.id!}
                dataSource={isSuccess(questionnaireListRD) ? questionnaireListRD.data : []}
                columns={columns}
                loading={isLoading(questionnaireListRD) && { indicator: SpinIndicator }}
            />
        </PageContainer>
    );
}
