import { useCallback } from 'react';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import {
    BaseQuestionnaireResponseForm,
    FormWrapperProps,
    fromQuestionnaireResponseFormData,
    Props,
    QuestionnaireResponseForm as FHIRQuestionnaireResponseForm,
} from '@beda.software/fhir-questionnaire/components';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import {
    groupControlComponents as readonlyGroupControlComponents,
    itemComponents as readonlyItemComponents,
    itemControlComponents as readonlyItemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/readonly-controls';
import { FormWrapper, GroupItemComponent, ReadonlyFormWrapper } from 'src/components/FormWrapper';
import { service } from 'src/services';

import { QRFProps } from './types';

type QuestionnaireResponseFormProps = QRFProps & {
    onEdit?: Props['onEdit'];
    FormWrapper?: Props['FormWrapper'];
    sdcServiceProvider?: Props['sdcServiceProvider'];
};

export function QuestionnaireResponseForm({
    onCancel,
    onSaveDraft,
    saveButtonTitle,
    cancelButtonTitle,
    FormFooterComponent,

    onQRFUpdate,
    itemControlQuestionItemComponents,
    itemControlGroupItemComponents,
    questionnaireResponseSaveService,
    questionnaireResponseDraftService,

    onEdit: onEditProp,
    FormWrapper: FormWrapperProp,
    sdcServiceProvider: sdcServiceProviderProp,

    questionnaireLoader,
    initialQuestionnaireResponse,
    launchContextParameters,
    onSuccess,
    onFailure,
    readOnly,
    customYupTests,
}: QuestionnaireResponseFormProps) {
    const onEditHandler = useCallback(
        async (formData: QuestionnaireResponseFormData) => {
            const { questionnaireResponse } = fromQuestionnaireResponseFormData(formData);
            onQRFUpdate!(questionnaireResponse);
        },
        [onQRFUpdate],
    );

    const qrfFormWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => (
            <FormWrapper
                {...wrapperProps}
                onCancel={onCancel}
                onSaveDraft={onSaveDraft}
                saveButtonTitle={saveButtonTitle}
                cancelButtonTitle={cancelButtonTitle}
                FormFooterComponent={FormFooterComponent}
            />
        ),
        [onCancel, onSaveDraft, saveButtonTitle, cancelButtonTitle, FormFooterComponent],
    );

    const sdcServiceProvider =
        sdcServiceProviderProp ??
        (questionnaireResponseSaveService || questionnaireResponseDraftService
            ? {
                  saveCompletedQuestionnaireResponse: questionnaireResponseSaveService,
                  saveInProgressQuestionnaireResponse: questionnaireResponseDraftService
                      ? (qr: Parameters<typeof questionnaireResponseDraftService>[0]) =>
                            questionnaireResponseDraftService(qr, undefined)
                      : undefined,
              }
            : undefined);

    return (
        <FHIRQuestionnaireResponseForm
            questionnaireLoader={questionnaireLoader}
            initialQuestionnaireResponse={initialQuestionnaireResponse}
            launchContextParameters={launchContextParameters}
            onSuccess={onSuccess as Props['onSuccess']}
            onFailure={onFailure}
            readOnly={readOnly}
            customYupTests={customYupTests}
            serviceProvider={{ service }}
            fhirService={service}
            sdcServiceProvider={sdcServiceProvider}
            FormWrapper={FormWrapperProp ?? qrfFormWrapper}
            groupItemComponent={GroupItemComponent}
            widgetsByQuestionType={itemComponents}
            widgetsByQuestionItemControl={itemControlQuestionItemComponents ?? itemControlComponents}
            widgetsByGroupQuestionItemControl={itemControlGroupItemComponents ?? groupControlComponents}
            onEdit={onEditProp ?? (onQRFUpdate ? onEditHandler : undefined)}
        />
    );
}

type ReadonlyQRFFormDataProps = {
    formData: QuestionnaireResponseFormData;
};

type ReadonlyQRFLoaderProps = Pick<Props, 'questionnaireLoader'> & Partial<Props>;

export function ReadonlyQuestionnaireResponseForm(props: ReadonlyQRFFormDataProps | ReadonlyQRFLoaderProps) {
    if ('formData' in props) {
        return (
            <BaseQuestionnaireResponseForm
                formData={props.formData}
                readOnly={true}
                fhirService={service}
                FormWrapper={ReadonlyFormWrapper}
                groupItemComponent={GroupItemComponent}
                widgetsByQuestionType={readonlyItemComponents}
                widgetsByQuestionItemControl={readonlyItemControlComponents}
                widgetsByGroupQuestionItemControl={readonlyGroupControlComponents}
            />
        );
    }

    return (
        <FHIRQuestionnaireResponseForm
            {...props}
            serviceProvider={props.serviceProvider ?? { service }}
            fhirService={props.fhirService ?? service}
            sdcServiceProvider={props.sdcServiceProvider}
            FormWrapper={props.FormWrapper ?? ReadonlyFormWrapper}
            groupItemComponent={props.groupItemComponent ?? GroupItemComponent}
            widgetsByQuestionType={props.widgetsByQuestionType ?? readonlyItemComponents}
            widgetsByQuestionItemControl={props.widgetsByQuestionItemControl ?? readonlyItemControlComponents}
            widgetsByGroupQuestionItemControl={
                props.widgetsByGroupQuestionItemControl ?? readonlyGroupControlComponents
            }
            readOnly={true}
        />
    );
}
