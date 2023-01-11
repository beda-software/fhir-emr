import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Col, Empty, Input, Row } from 'antd';
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
import { Table } from 'src/components/Table';

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
                                <span><Trans>Add questionnaire</Trans></span>
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <div
                    style={{
                        position: 'relative',
                        padding: 16,
                        height: 64,
                        borderRadius: 10,
                        backgroundColor: '#C0D4FF',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Input.Search placeholder={t`Find questionnaire`} style={{ width: 264 }} />
                    <Button>
                        <Trans>Reset</Trans>
                    </Button>
                </div>
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
                    dataSource={
                        isSuccess(questionnairesResponse) ? questionnairesResponse.data : []
                    }
                    columns={columns}
                    loading={isLoading(questionnairesResponse)}
                />
            </BasePageContent>
        </BaseLayout>
    );
}
