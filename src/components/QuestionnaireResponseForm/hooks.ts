import {
    useQuestionnaireResponseForm as useFHIRQuestionnaireResponseForm,
    Props,
} from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { saveFHIRResource, sdcService, service } from 'src/services';

export function useQuestionnaireResponseForm(props: Pick<Props, 'questionnaireLoader'> & Partial<Props>) {
    return useFHIRQuestionnaireResponseForm({
        ...props,
        serviceProvider: props.serviceProvider ?? {
            service,
            saveFHIRResource,
        },
        fhirService: props.fhirService ?? service,
        sdcService: props.sdcService ?? sdcService,
        FormWrapper: props.FormWrapper ?? FormWrapper,
        groupItemComponent: props.groupItemComponent ?? GroupItemComponent,
        widgetsByQuestionType: props.widgetsByQuestionType ?? itemComponents,
        widgetsByQuestionItemControl: props.widgetsByQuestionItemControl ?? itemControlComponents,
        widgetsByGroupQuestionItemControl: props.widgetsByGroupQuestionItemControl ?? groupControlComponents,
    });
}
