import { notification } from 'antd';
import _ from 'lodash';
import {
    FormItems,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
} from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { saveFHIRResource, updateFHIRResource } from 'aidbox-react/lib/services/fhir';
import { formatError } from 'aidbox-react/lib/utils/error';

import { QuestionnaireResponseItem } from 'shared/src/contrib/aidbox';
import {
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
    useQuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';

import { Spinner } from '../Spinner';

interface Props extends QuestionnaireResponseFormProps {
    onSuccess?: (resource: any) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    onCancel?: () => void;
}

export function useQuestionnaireResponseForm(props: Props) {
    const { response, handleSave } = useQuestionnaireResponseFormData(props);
    const { onSuccess, onFailure, readOnly, initialQuestionnaireResponse, onCancel } = props;

    const onSubmit = async (formData: QuestionnaireResponseFormData) => {
        const modifiedFormData = _.merge({}, formData, {
            context: {
                questionnaireResponse: {
                    questionnaire: initialQuestionnaireResponse?.questionnaire,
                },
            },
        });

        delete modifiedFormData.context.questionnaireResponse.meta;

        const saveResponse = await handleSave(modifiedFormData);

        if (isSuccess(saveResponse)) {
            if (saveResponse.data.extracted) {
                if (onSuccess) {
                    onSuccess(saveResponse.data);
                } else {
                    notification.success({
                        message: 'Form successfully saved',
                    });
                }
            } else {
                if (onFailure) {
                    onFailure('Error while extracting');
                } else {
                    notification.error({ message: 'Error while extracting' });
                }
            }
        } else {
            if (onFailure) {
                onFailure(saveResponse.error);
            } else {
                notification.error({ message: formatError(saveResponse.error) });
            }
        }
    };

    const onSaveDraft = async (formData: QuestionnaireResponseFormData) => {
        const qrfdWithQuestionnaireName = _.merge({}, formData, {
            context: {
                questionnaireResponse: {
                    questionnaire: initialQuestionnaireResponse?.questionnaire,
                },
            },
        });

        const isCreating = formData.context.questionnaireResponse.id === undefined;
        const transformedFormValues = transformFormValuesIntoItem(formData.formValues);

        const questionnaireResponse = {
            id: formData.context.questionnaireResponse.id,
            item: transformedFormValues,
            questionnaire: isCreating
                ? qrfdWithQuestionnaireName.context.questionnaireResponse.questionnaire
                : formData.context.questionnaire.assembledFrom,
            resourceType: formData.context.questionnaireResponse.resourceType,
            source: formData.context.questionnaireResponse.source,
            status: 'in-progress',
            authored: new Date().toISOString(),
        };

        const response = isCreating
            ? await saveFHIRResource(questionnaireResponse)
            : await updateFHIRResource(questionnaireResponse);

        return response;
    };

    return { response, onSubmit, readOnly, onCancel, onSaveDraft };
}

function transformFormValuesIntoItem(inputData: FormItems): QuestionnaireResponseItem[] {
    const outputData: QuestionnaireResponseItem[] = [];

    for (const key in inputData) {
        const item = inputData[key];

        if (Array.isArray(item)) {
            outputData.push({
                linkId: key,
                answer: item.map((obj) => (obj && 'value' in obj ? { value: obj.value } : {})),
            });
        } else if (typeof item === 'object' && item.items) {
            const subItems: QuestionnaireResponseItem[] = [];

            for (const subKey in item.items) {
                const subItem = item.items[subKey];

                if (Array.isArray(subItem)) {
                    subItems.push({
                        linkId: subKey,
                        answer: subItem.map((obj) =>
                            obj && 'value' in obj ? { value: obj.value } : {},
                        ),
                    });
                } else if (typeof subItem === 'object' && subItem.items) {
                    const deepItems: QuestionnaireResponseItem[] = [];

                    for (const deepKey in subItem.items) {
                        const deepItem = subItem.items[deepKey];

                        if (Array.isArray(deepItem)) {
                            deepItems.push({
                                linkId: deepKey,
                                answer: deepItem.map((obj) =>
                                    obj && 'value' in obj ? { value: obj.value } : {},
                                ),
                            });
                        }
                    }

                    subItems.push({
                        linkId: subKey,
                        item: deepItems,
                    });
                }
            }

            outputData.push({
                linkId: key,
                item: subItems,
            });
        }
    }

    return outputData;
}

export function QuestionnaireResponseForm(props: Props) {
    const { response, onSubmit, readOnly, onCancel } = useQuestionnaireResponseForm(props);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(formData) => (
                <BaseQuestionnaireResponseForm
                    formData={formData}
                    onSubmit={onSubmit}
                    readOnly={readOnly}
                    onCancel={onCancel}
                    {...props}
                />
            )}
        </RenderRemoteData>
    );
}
