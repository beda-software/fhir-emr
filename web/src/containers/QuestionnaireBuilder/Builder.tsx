import { t } from '@lingui/macro';
import { Alert, Typography } from 'antd';
import { RemoteData } from 'fhir-react';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { mapFormToResponse } from 'sdc-qrf';

import { toQuestionnaireResponseFormData } from 'shared/src/hooks/questionnaire-response-form-data';
import { fromFirstClassExtension } from 'shared/src/utils/converter';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';

import s from './QuestionnaireBuilder.module.scss';

const { Title } = Typography;

export function Builder(props: { response: RemoteData; error?: string }) {
    const { response, error } = props;

    return (
        <RenderRemoteData
            remoteData={response}
            renderLoading={() => (
                <div
                    style={{
                        height: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    {t`The process of generating or updating a questionnaire may require some time to complete`}
                    <Spinner />
                </div>
            )}
        >
            {(questionnaire) => {
                const formData = toQuestionnaireResponseFormData(questionnaire, {
                    resourceType: 'QuestionnaireResponse',
                    status: 'completed',
                });
                console.log('FHIR Questionnaire', questionnaire);
                console.log('formData', formData);
                const title = formData.context.questionnaire.title || formData.context.questionnaire.name;

                if (questionnaire.item) {
                    return (
                        <>
                            {error ? (
                                <Alert message={error} type="error" showIcon closable style={{ marginBottom: 30 }} />
                            ) : null}
                            <Title level={3} className={s.title}>
                                {title}
                            </Title>
                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={async (values) =>
                                    console.log(
                                        'result',
                                        fromFirstClassExtension({
                                            ...values.context.questionnaireResponse,
                                            ...mapFormToResponse(values.formValues, values.context.questionnaire),
                                        }),
                                    )
                                }
                            />
                        </>
                    );
                }

                return (
                    <>
                        {error ? (
                            <Alert message={error} type="error" showIcon closable style={{ marginBottom: 30 }} />
                        ) : null}
                        <Title level={4} className={s.title} style={{ color: 'rgba(5, 5, 5, 0.3)' }}>
                            {t`Here will be your questionnaire`}
                        </Title>
                    </>
                );
            }}
        </RenderRemoteData>
    );
}
