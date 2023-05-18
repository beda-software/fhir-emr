import { t, Trans } from '@lingui/macro';
import { Alert, notification, Typography } from 'antd';
import { notAsked, RemoteData } from 'fhir-react';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isFailure, isSuccess, loading, success } from 'fhir-react/lib/libs/remoteData';
import { isLoading } from 'fhir-react/lib/libs/remoteData';
import { getFHIRResource, saveFHIRResource } from 'fhir-react/lib/services/fhir';
import { formatError } from 'fhir-react/lib/utils/error';
import { Questionnaire, QuestionnaireItem } from 'fhir/r4b';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { toQuestionnaireResponseFormData } from 'shared/src/hooks/questionnaire-response-form-data';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { generateQuestionnaire } from 'src/services/questionnaire-builder';

import { PromptForm } from './PromptForm';
import s from './QuestionnaireBuilder.module.scss';

const { Title } = Typography;

function cleanUpQuestionnaire(questionnaire: Questionnaire) {
    function cleanUpItems(item: Questionnaire['item']): Questionnaire['item'] {
        return item?.reduce((acc, qItem) => {
            if (!qItem.linkId) {
                return acc;
            }

            return [...acc, { ...qItem, item: cleanUpItems(qItem.item) }];
        }, [] as QuestionnaireItem[]);
    }

    return { ...questionnaire, item: cleanUpItems(questionnaire.item) };
}

function useQuestionnaireBuilder() {
    const navigate = useNavigate();
    const params = useParams();
    const [response, setResponse] = useState<RemoteData>(notAsked);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        (async () => {
            setResponse(loading);
            if (params.id) {
                const r = await getFHIRResource<Questionnaire>({
                    reference: `Questionnaire/${params.id}`,
                });
                setResponse(r);

                return;
            }

            const initialQuestionnaire: Questionnaire = {
                resourceType: 'Questionnaire',
                status: 'draft',
                meta: {
                    profile: ['https://beda.software/beda-emr-questionnaire'],
                },
            };

            setResponse(success(initialQuestionnaire));
        })();
    }, [params.id]);

    const onSaveQuestionnaire = async (resource: Questionnaire) => {
        const saveResponse = await saveFHIRResource(cleanUpQuestionnaire(resource));

        if (isSuccess(saveResponse)) {
            setResponse(saveResponse);
            navigate(`/questionnaires/${saveResponse.data.id}/edit`, { replace: true });
            notification.success({ message: 'The questionnaire is saved' });
        } else {
            notification.error({ message: formatError(saveResponse.error) });
            setError(formatError(saveResponse.error));
        }
    };

    const onSubmitPrompt = useCallback(
        async (prompt: string) => {
            if (isSuccess(response)) {
                setResponse(loading);
                setError(undefined);
                const questionnaire = response.data;
                const saveResponse = await generateQuestionnaire(prompt, JSON.stringify(questionnaire));
                console.log('saveResponse', saveResponse);

                if (isSuccess(saveResponse)) {
                    try {
                        const newQuestionnaire = JSON.parse(saveResponse.data);
                        setResponse(success(newQuestionnaire));
                    } catch (error: any) {
                        notification.error({ message: 'Something went wrong please try again or rewrite the message' });
                        setResponse(success(response.data));
                        setError('Something went wrong please try again or rewrite the message');
                    }
                }

                if (isFailure(saveResponse)) {
                    notification.error({
                        message:
                            saveResponse.error?.message ||
                            'Something went wrong please try again or rewrite the message',
                    });
                    setError(saveResponse.error?.message);
                    setResponse(success(response.data));
                }
            }
        },
        [response],
    );

    return { response, onSaveQuestionnaire, onSubmitPrompt, error };
}

export function QuestionnaireBuilder() {
    const { response, onSubmitPrompt, error } = useQuestionnaireBuilder();

    return (
        <>
            <BasePageHeader>
                <Title>
                    <Trans>Questionnaire</Trans>
                </Title>
            </BasePageHeader>
            <BasePageContent className={s.container}>
                <div className={s.content}>
                    <PromptForm
                        className={s.promptForm}
                        onSubmit={(prompt) => onSubmitPrompt(prompt)}
                        isLoading={isLoading(response)}
                    />
                    <div className={s.questionnaireForm}>
                        <Builder response={response} error={error} />
                    </div>
                </div>
            </BasePageContent>
        </>
    );
}

function Builder(props: { response: RemoteData; error?: string }) {
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
                            <BaseQuestionnaireResponseForm formData={formData} />
                        </>
                    );
                }

                return (
                    <Title level={4} className={s.title} style={{ color: 'rgba(5, 5, 5, 0.3)' }}>
                        {t`Here will be your questionnaire`}
                    </Title>
                );
            }}
        </RenderRemoteData>
    );
}
