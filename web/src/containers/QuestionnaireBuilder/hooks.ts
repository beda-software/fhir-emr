import { notification } from 'antd';
import { notAsked, RemoteData } from 'fhir-react';
import { isFailure, isSuccess, loading, success } from 'fhir-react/lib/libs/remoteData';
import { getFHIRResource, saveFHIRResource } from 'fhir-react/lib/services/fhir';
import { formatError } from 'fhir-react/lib/utils/error';
import { Questionnaire, QuestionnaireItem } from 'fhir/r4b';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionItemProps } from 'sdc-qrf';

import { fromFirstClassExtension } from 'shared/src/utils/converter';

import { generateQuestionnaire } from 'src/services/questionnaire-builder';

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

export function useQuestionnaireBuilder() {
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
                    const newQuestionnaire = saveResponse.data;
                    setResponse(success(newQuestionnaire));
                }

                if (isFailure(saveResponse)) {
                    setError(
                        saveResponse.error?.message || 'Something went wrong please try again or rewrite the message',
                    );
                    setResponse(success(response.data));
                }
            }
        },
        [response],
    );

    const onItemChange = useCallback(
        (item: QuestionItemProps) => {
            if (isSuccess(response)) {
                const path = ['item', ...item.parentPath];
                const items = _.get(response.data, path.join('.'));
                const itemIndex = Array.isArray(items)
                    ? items.findIndex((i) => i.linkId === item.questionItem.linkId)
                    : -1;

                if (itemIndex > -1) {
                    const name = [...path, itemIndex].join('.');
                    const fhirQuestionItem = fromFirstClassExtension({
                        resourceType: 'Questionnaire',
                        status: 'draft',
                        meta: {
                            profile: ['https://beda.software/beda-emr-questionnaire'],
                        },
                        item: [item.questionItem],
                    }).item![0]!;
                    const resultQuestionnaire = _.set({ ...response.data }, name, fhirQuestionItem);
                    setResponse(success(resultQuestionnaire));
                }
            }
        },
        [response],
    );

    return { response, onSaveQuestionnaire, onSubmitPrompt, onItemChange, error };
}
