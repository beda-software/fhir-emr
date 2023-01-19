import { Button, Col, Empty, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import Title from 'antd/es/typography/Title';
import { ColumnsType } from 'antd/lib/table';
import { Link } from 'react-router-dom';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import config from 'shared/src/config';
import { Questionnaire } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseLayout, BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { SearchBar } from 'src/components/SearchBar';
import { Table } from 'src/components/Table';
import { useSearchBar } from 'src/components/SearchBar/hooks';

const columns: ColumnsType<Questionnaire> = [
    {
        title: <Trans id="msg.QuestionnaireName">Name</Trans>,
        dataIndex: 'name',
        key: 'name',
        render: (_text, resource) => resource.name || resource.id,
    },

    {
        title: <Trans>Actions</Trans>,
        width: 500,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, resource) => {
            return (
                <>
                    <ModalTrigger
                        trigger={
                            <Button type="link">
                                <Trans>Open</Trans>
                            </Button>
                        }
                        title={resource.name || resource.id!}
                    >
                        {() => (
                            <QuestionnaireResponseForm
                                questionnaireLoader={questionnaireIdLoader(resource.id!)}
                                launchContextParameters={resource.launchContext?.map((lc) => ({
                                    name: lc.name!,
                                    value: { string: 'undefined' },
                                }))}
                            />
                        )}
                    </ModalTrigger>{' '}
                    <Link to={`/questionnaires/${resource.id}/edit`}>
                        <Button type="link">
                            <Trans>Edit in builder</Trans>
                        </Button>
                    </Link>
                    <Button
                        type="link"
                        onClick={() =>
                            window.open(
                                `${config.sdcIdeUrl}/#/${resource.id}`,
                                '_blank',
                                'noopener,noreferrer',
                            )
                        }
                    >
                        <Trans>Edit in SDC IDE</Trans>
                    </Button>
                    {/*</Link>*/}
                </>
            );
        },
    },
];

export function QuestionnaireList() {
    const [questionnairesResponse] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', {}),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        ),
    );

    const { columnsFilterValues, filteredData, onChangeColumnFilter, onResetFilters } =
        useSearchBar<Questionnaire>({
            columns: [
                {
                    id: 'questionnaire',
                    type: 'string',
                    key: 'name',
                    placeholder: t`Find questionnaire`,
                },
            ],
            data: isSuccess(questionnairesResponse) ? questionnairesResponse.data : [],
        });

    return (
        <BaseLayout>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Questionnaires</Trans>
                        </Title>
                    </Col>
                    <Col>
                        <Link to="/questionnaires/builder">
                            <Button icon={<PlusOutlined />} type="primary">
                                <span>
                                    <Trans>Add questionnaire</Trans>
                                </span>
                            </Button>
                        </Link>
                    </Col>
                </Row>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    filteredData={filteredData}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <Table<Questionnaire>
                    locale={{
                        emptyText: (
                            <>
                                <Empty
                                    description={<Trans>No data</Trans>}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </>
                        ),
                    }}
                    rowKey={(p) => p.id!}
                    dataSource={filteredData}
                    columns={columns}
                    loading={isLoading(questionnairesResponse)}
                />
            </BasePageContent>
        </BaseLayout>
    );
}
