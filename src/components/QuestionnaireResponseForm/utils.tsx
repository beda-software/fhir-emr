import { t } from '@lingui/macro';
import { formatFHIRDate } from 'aidbox-react';
import { notification } from 'antd';
import { QuestionnaireResponse } from 'fhir/r4b';
import moment from 'moment';
import { FormItems, fromFirstClassExtension, mapFormToResponse, QuestionnaireResponseFormData } from 'sdc-qrf';

import { formatError } from '@beda.software/fhir-react';
import { isFailure, isSuccess, RemoteDataResult } from '@beda.software/remote-data';

import { QuestionnaireResponseFormSaveResponse } from 'src/hooks/questionnaire-response-form-data';
import { patchFHIRResource, saveFHIRResource } from 'src/services/fhir';

export const saveQuestionnaireResponseDraft = async (
    questionnaireId: string,
    formData: QuestionnaireResponseFormData,
    currentFormValues: FormItems,
) => {
    const isCreating = !formData.context.questionnaireResponse.id;
    const transformedFormValues = mapFormToResponse(currentFormValues, formData.context.questionnaire);

    const questionnaireResponse: QuestionnaireResponse = {
        ...fromFirstClassExtension(formData.context.questionnaireResponse),
        id: formData.context.questionnaireResponse.id,
        encounter: formData.context.questionnaireResponse.encounter,
        item: transformedFormValues.item,
        questionnaire: formData.context.questionnaire.assembledFrom,
        resourceType: formData.context.questionnaireResponse.resourceType,
        subject: formData.context.questionnaireResponse.subject,
        status: 'in-progress',
        authored: formatFHIRDate(moment()),
    };

    const response = isCreating
        ? await saveFHIRResource(questionnaireResponse)
        : await patchFHIRResource<QuestionnaireResponse>(questionnaireResponse, { status: 'in-progress' });

    if (isCreating && isSuccess(response)) {
        formData.context.questionnaireResponse.id = response.data.id;
    }

    if (isFailure(response)) {
        console.error(t`Error saving a draft: `, response.error);
    }

    return response;
};

export function onFormResponse(props: {
    response: RemoteDataResult<QuestionnaireResponseFormSaveResponse>;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
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
            if (onSuccess && response.error.questionnaireResponse) {
                onSuccess(response.error.questionnaireResponse);
            }
        }
    }
}
