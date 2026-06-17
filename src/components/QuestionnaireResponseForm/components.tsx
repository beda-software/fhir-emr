import { useCallback, useContext, useMemo } from 'react';
import {
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionnaireResponseFormData,
} from 'sdc-qrf';

import {
    BaseQuestionnaireResponseForm,
    FormWrapperProps,
    Props,
    QuestionnaireResponseForm as FHIRQuestionnaireResponseForm,
} from '@beda.software/fhir-questionnaire/components';

import {
    ItemControlGroupItemReadonlyWidgetsContext,
    ItemControlGroupItemWidgetsContext,
    ItemControlQuestionItemReadonlyWidgetsContext,
    ItemControlQuestionItemWidgetsContext,
} from 'src/components/BaseQuestionnaireResponseForm/context';
import {
    itemComponents as defaultItemComponents,
    itemControlComponents as defaultItemControlComponents,
    groupControlComponents as defaultGroupControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import {
    itemComponents as readonlyItemComponents,
    itemControlComponents as readonlyItemControlComponents,
    groupControlComponents as readonlyGroupControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/readonly-controls';
import { FormWrapper, GroupItemComponent, ReadonlyFormWrapper } from 'src/components/FormWrapper';
import { service } from 'src/services';

import { QuestionnaireResponseFormProps } from './types';

export function QuestionnaireResponseForm({
    onCancel,
    onSaveDraft,
    saveButtonTitle,
    cancelButtonTitle,
    FormFooterComponent,

    itemControlQuestionItemComponents,
    itemControlGroupItemComponents,
    questionnaireResponseSaveService,
    questionnaireResponseDraftService,

    onEdit,
    FormWrapper: FormWrapperProp,
    serviceProvider: serviceProviderProp,
    sdcServiceProvider: sdcServiceProviderProp,

    questionnaireLoader,
    initialQuestionnaireResponse,
    launchContextParameters,
    onSuccess,
    onFailure,
    readOnly,
    customYupTests,
}: QuestionnaireResponseFormProps) {
    const ItemControlQuestionItemWidgetsFromContext = useContext(ItemControlQuestionItemWidgetsContext);
    const ItemControlGroupItemWidgetsFromContext = useContext(ItemControlGroupItemWidgetsContext);

    const mergedItemControlComponents = useMemo(
        () => ({
            ...(itemControlQuestionItemComponents ?? defaultItemControlComponents),
            ...ItemControlQuestionItemWidgetsFromContext,
        }),
        [ItemControlQuestionItemWidgetsFromContext, itemControlQuestionItemComponents],
    );

    const mergedGroupControlComponents = useMemo(
        () => ({
            ...(itemControlGroupItemComponents ?? defaultGroupControlComponents),
            ...ItemControlGroupItemWidgetsFromContext,
        }),
        [ItemControlGroupItemWidgetsFromContext, itemControlGroupItemComponents],
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
            serviceProvider={serviceProviderProp ?? { service }}
            fhirService={service}
            sdcServiceProvider={sdcServiceProvider}
            FormWrapper={FormWrapperProp ?? qrfFormWrapper}
            groupItemComponent={GroupItemComponent}
            questionItemComponents={defaultItemComponents}
            itemControlQuestionItemComponents={mergedItemControlComponents}
            itemControlGroupItemComponents={mergedGroupControlComponents}
            onEdit={onEdit}
        />
    );
}

type ReadonlyQRFFormDataProps = {
    formData: QuestionnaireResponseFormData;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
};

type ReadonlyQRFLoaderProps = Pick<Props, 'questionnaireLoader'> & Partial<Props>;

export function ReadonlyQuestionnaireResponseForm(props: ReadonlyQRFFormDataProps | ReadonlyQRFLoaderProps) {
    const ItemControlQuestionItemReadonlyWidgetsFromContext = useContext(ItemControlQuestionItemReadonlyWidgetsContext);
    const ItemControlGroupItemReadonlyWidgetsFromContext = useContext(ItemControlGroupItemReadonlyWidgetsContext);

    const mergedItemControlComponents = useMemo(
        () => ({
            ...readonlyItemControlComponents,
            ...(props.itemControlQuestionItemComponents ?? {}),
            ...ItemControlQuestionItemReadonlyWidgetsFromContext,
        }),
        [ItemControlQuestionItemReadonlyWidgetsFromContext, props],
    );

    const mergedGroupControlComponents = useMemo(
        () => ({
            ...readonlyGroupControlComponents,
            ...(props.itemControlGroupItemComponents ?? {}),
            ...ItemControlGroupItemReadonlyWidgetsFromContext,
        }),
        [ItemControlGroupItemReadonlyWidgetsFromContext, props],
    );

    if ('formData' in props) {
        return (
            <BaseQuestionnaireResponseForm
                formData={props.formData}
                readOnly={true}
                fhirService={service}
                FormWrapper={ReadonlyFormWrapper}
                groupItemComponent={GroupItemComponent}
                questionItemComponents={readonlyItemComponents}
                itemControlQuestionItemComponents={mergedItemControlComponents}
                itemControlGroupItemComponents={mergedGroupControlComponents}
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
            questionItemComponents={props.questionItemComponents ?? readonlyItemComponents}
            itemControlQuestionItemComponents={mergedItemControlComponents}
            itemControlGroupItemComponents={mergedGroupControlComponents}
            readOnly={true}
        />
    );
}
