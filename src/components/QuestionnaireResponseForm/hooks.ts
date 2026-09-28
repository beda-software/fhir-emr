import { useQuestionnaireResponseForm as useFHIRQuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { service } from 'src/services';

import { QuestionnaireResponseFormProps } from './types';
import { withFormResponseHandlers } from './utils';

export function useQuestionnaireResponseForm(props: QuestionnaireResponseFormProps) {
    const { onSuccess, onFailure } = withFormResponseHandlers({
        onSuccess: props.onSuccess,
        onFailure: props.onFailure,
    });

    return useFHIRQuestionnaireResponseForm({
        ...props,
        onSuccess,
        onFailure,
        serviceProvider: props.serviceProvider ?? {
            service,
        },
        fhirService: props.fhirService ?? service,
        FormWrapper: props.FormWrapper ?? FormWrapper,
        groupItemComponent: props.groupItemComponent ?? GroupItemComponent,
        questionItemComponents: props.questionItemComponents ?? itemComponents,
        itemControlQuestionItemComponents: props.itemControlQuestionItemComponents ?? itemControlComponents,
        itemControlGroupItemComponents: props.itemControlGroupItemComponents ?? groupControlComponents,
    });
}
