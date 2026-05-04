import {
    useQuestionnaireResponseForm as useFHIRQuestionnaireResponseForm,
    Props,
} from '@beda.software/fhir-questionnaire/components';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { service } from 'src/services';

export function useQuestionnaireResponseForm(props: Pick<Props, 'questionnaireLoader'> & Partial<Props>) {
    return useFHIRQuestionnaireResponseForm({
        ...props,
        serviceProvider: props.serviceProvider ?? {
            service,
        },
        fhirService: props.fhirService ?? service,
        FormWrapper: props.FormWrapper ?? FormWrapper,
        groupItemComponent: props.groupItemComponent ?? GroupItemComponent,
        questionItemComponents: props.questionItemComponents ?? props.widgetsByQuestionType ?? itemComponents,
        itemControlQuestionItemComponents:
            props.itemControlQuestionItemComponents ?? props.widgetsByQuestionItemControl ?? itemControlComponents,
        itemControlGroupItemComponents:
            props.itemControlGroupItemComponents ?? props.widgetsByGroupQuestionItemControl ?? groupControlComponents,
    });
}
