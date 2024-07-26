import { notification } from 'antd';
import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import { useMemo } from 'react';
import {
    FormItems,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    mapFormToResponse,
} from 'sdc-qrf';

import { RenderRemoteData, formatError } from '@beda.software/fhir-react';
import { RemoteDataResult, isFailure, isSuccess } from '@beda.software/remote-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import {
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
    useQuestionnaireResponseFormData,
} from 'src/hooks/questionnaire-response-form-data';
import { saveFHIRResource, updateFHIRResource } from 'src/services/fhir';

import { FormFooterComponentProps } from '../BaseQuestionnaireResponseForm/FormFooter';
import { Spinner } from '../Spinner';

interface Props extends QuestionnaireResponseFormProps {
    onSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    onCancel?: () => void;

    FormFooterComponent?: React.ElementType<FormFooterComponentProps>;
    saveButtonTitle?: string;
    cancelButtonTitle?: string;
}

export const saveQuestionnaireResponseDraft = async (
    questionnaireId: string,
    formData: QuestionnaireResponseFormData,
    currentFormValues: FormItems,
) => {
    const isCreating = formData.context.questionnaireResponse.id === undefined;
    const transformedFormValues = mapFormToResponse(currentFormValues, formData.context.questionnaire);

    const questionnaireResponse: QuestionnaireResponse = {
        id: formData.context.questionnaireResponse.id,
        encounter: formData.context.questionnaireResponse.encounter,
        item: transformedFormValues.item,
        questionnaire: isCreating ? questionnaireId : formData.context.questionnaire.assembledFrom,
        resourceType: formData.context.questionnaireResponse.resourceType,
        subject: formData.context.questionnaireResponse.subject,
        status: 'in-progress',
        authored: new Date().toISOString(),
    };

    const response = isCreating
        ? await saveFHIRResource(questionnaireResponse)
        : await updateFHIRResource(questionnaireResponse);

    if (isSuccess(response)) {
        formData.context.questionnaireResponse.id = response.data.id;
    }
    if (isFailure(response)) {
        console.error('Error saving a draft: ', response.error);
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
            if (onSuccess) {
                onSuccess(response.data);
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
            onFailure(response.error);
        } else {
            notification.error({ message: formatError(response.error) });
        }
    }
}

export function useQuestionnaireResponseForm(props: Props) {
    // TODO find what cause rerender and fix it
    // remove this temporary hack
    const memoizedProps = useMemo(() => props, [JSON.stringify(props)]);

    const { response, handleSave } = useQuestionnaireResponseFormData(memoizedProps);
    const { onSuccess, onFailure, readOnly, initialQuestionnaireResponse, onCancel } = memoizedProps;

    const onSubmit = async (formData: QuestionnaireResponseFormData) => {
        const modifiedFormData = _.merge({}, formData, {
            context: {
                questionnaireResponse: {
                    questionnaire: initialQuestionnaireResponse?.questionnaire,
                },
            },
        });

        /* delete modifiedFormData.context.questionnaireResponse.meta; */

        const saveResponse = await handleSave(modifiedFormData);
        onFormResponse({ response: saveResponse, onSuccess, onFailure });
    };

    return { response, onSubmit, readOnly, onCancel };
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
