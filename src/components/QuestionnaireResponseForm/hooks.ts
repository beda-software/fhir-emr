import { useQuestionnaireResponseForm as useFHIRQuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { service } from 'src/services';

import { QuestionnaireResponseFormProps } from './types';

export function useQuestionnaireResponseForm(props: QuestionnaireResponseFormProps) {
    return useFHIRQuestionnaireResponseForm({
        ...props,
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
