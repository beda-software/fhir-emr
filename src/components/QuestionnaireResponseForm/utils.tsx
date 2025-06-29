import { t } from '@lingui/macro';
import { notification } from 'antd';
import { QuestionnaireResponse, Resource } from 'fhir/r4b';
import moment from 'moment';
import { FormItems, mapFormToResponse, mapResponseToForm, QuestionnaireResponseFormData } from 'sdc-qrf';

import { formatError, formatFHIRDateTime } from '@beda.software/fhir-react';
import { failure, isFailure, isSuccess, RemoteDataResult, success } from '@beda.software/remote-data';

import {
    QuestionnaireResponseFormSaveResponse,
    getQuestionnaireResponseDraftServices,
    QuestionnaireResponseDraftService,
    QuestionnaireResponseFormSaveResponseFailure,
} from 'src/hooks/questionnaire-response-form-data';

export const saveQuestionnaireResponseDraft = async (
    id: Resource['id'],
    formData: QuestionnaireResponseFormData,
    currentFormValues: FormItems,
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    const transformedFormValues = mapFormToResponse(currentFormValues, formData.context.questionnaire);

    const questionnaireResponse: QuestionnaireResponse = {
        ...formData.context.questionnaireResponse,
        item: transformedFormValues.item,
        questionnaire: formData.context.fceQuestionnaire.assembledFrom,
        status: 'in-progress',
        authored: formatFHIRDateTime(moment()),
    };

    const response = await getQuestionnaireResponseDraftServices(qrDraftServiceType).saveService(
        questionnaireResponse,
        id,
    );

    if (isFailure(response)) {
        console.error(t`Error saving a draft: `, response.error);
    }

    return response;
};

export const loadQuestionnaireResponseDraft = (
    id: Resource['id'],
    formData: QuestionnaireResponseFormData,
    qrDraftServiceType: QuestionnaireResponseDraftService,
): RemoteDataResult<QuestionnaireResponse> => {
    const draftQR = getQuestionnaireResponseDraftServices(qrDraftServiceType).loadService(id);

    if (!isSuccess(draftQR)) {
        return draftQR;
    }

    formData.context.questionnaireResponse = draftQR.data;
    formData.formValues = mapResponseToForm(formData.context.questionnaireResponse, formData.context.questionnaire);

    return success(draftQR.data);
};

export const deleteQuestionnaireResponseDraft = async (
    id: Resource['id'],
    qrDraftServiceType: QuestionnaireResponseDraftService,
) => {
    if (!id) {
        return Promise.resolve(failure(t`Resource id not provided`));
    }

    return await getQuestionnaireResponseDraftServices(qrDraftServiceType).deleteService(id);
};

export function onFormResponse(props: {
    response: RemoteDataResult<QuestionnaireResponseFormSaveResponse, QuestionnaireResponseFormSaveResponseFailure>;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: QuestionnaireResponseFormSaveResponseFailure) => void;
}) {
    const { response, onSuccess, onFailure } = props;

    if (isSuccess(response)) {
        if (response.data.extracted) {
            const warnings: string[] = [];
            response.data.extractedBundle.forEach((bundle, index) => {
                bundle.entry?.forEach((entry, jndex) => {
                    if (entry.resource?.resourceType === 'OperationOutcome') {
                        warnings.push(`Error extracting on ${index}, ${jndex}`);
                    }
                });
            });
            if (warnings.length > 0) {
                notification.warning({
                    message: (
                        <div>
                            {warnings.map((w) => (
                                <div key={w}>
                                    <span>{w}</span>
                                    <br />
                                </div>
                            ))}
                        </div>
                    ),
                });
            }

            if (onSuccess) {
                onSuccess(response.data);
            } else {
                notification.success({
                    message: t`Form successfully saved`,
                });
            }
        }
    } else {
        if (onFailure) {
            onFailure(response.error);
        } else {
            if (response.error.extractedError) {
                notification.error({ message: formatError(response.error.extractedError) });
            }
        }
    }
}
