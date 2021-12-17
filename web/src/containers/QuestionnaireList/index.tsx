import { PageHeader, Button, Table, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Questionnaire } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseLayout } from 'src/components/BaseLayout';
import { ModalNewQuestionnaire } from 'src/components/ModalNewQuestionnaire';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

const columns: ColumnsType<Questionnaire> = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        render: (_text, resource) => resource.name || resource.id,
    },

    {
        title: 'Действия',
        width: 300,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, resource) => {
            return (
                <>
                    <ModalTrigger
                        trigger={<Button type="link">Просмотр</Button>}
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
                    <Button type="link">Редактировать</Button>
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
        <BaseLayout bgHeight={281}>
            <PageHeader title="Опросники" extra={[<ModalNewQuestionnaire />]} />
            <div
                style={{
                    position: 'relative',
                    padding: 16,
                    height: 64,
                    borderRadius: 10,
                    backgroundColor: '#C0D4FF',
                    marginBottom: 36,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Input.Search placeholder="Найти опросник" style={{ width: 264 }} />
                <Button>Сбросить</Button>
            </div>
            <Table<Questionnaire>
                rowKey={(p) => p.id!}
                dataSource={isSuccess(questionnairesResponse) ? questionnairesResponse.data : []}
                columns={columns}
                loading={isLoading(questionnairesResponse)}
            />
        </BaseLayout>
    );
}
