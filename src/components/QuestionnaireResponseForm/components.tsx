import {
    QuestionnaireResponseForm as FHIRQuestionnaireResponseForm,
    Props,
} from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import { persistSaveQuestionnaireReponseService } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';

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

export function QuestionnaireResponseForm(props: Pick<Props, 'questionnaireLoader'> & Partial<Props>) {
    return (
        <FHIRQuestionnaireResponseForm
            {...props}
            serviceProvider={
                props.serviceProvider ?? {
                    service,
                }
            }
            fhirService={props.fhirService ?? service}
            sdcServiceProvider={{
                service: props.sdcServiceProvider?.service ?? props.fhirService ?? service,
                assemble: props.sdcServiceProvider?.assemble ?? props.fhirService ?? service,
                constraintCheck: props.sdcServiceProvider?.constraintCheck ?? props.fhirService ?? service,
                populate: props.sdcServiceProvider?.populate ?? props.fhirService ?? service,
                extract: props.sdcServiceProvider?.extract ?? props.fhirService ?? service,
                saveQuestionnaireResponse:
                    props.sdcServiceProvider?.saveQuestionnaireResponse ?? persistSaveQuestionnaireReponseService,
            }}
            FormWrapper={props.FormWrapper ?? FormWrapper}
            groupItemComponent={props.groupItemComponent ?? GroupItemComponent}
            widgetsByQuestionType={props.widgetsByQuestionType ?? itemComponents}
            widgetsByQuestionItemControl={props.widgetsByQuestionItemControl ?? itemControlComponents}
            widgetsByGroupQuestionItemControl={props.widgetsByGroupQuestionItemControl ?? groupControlComponents}
        />
    );
}

export function ReadonlyQuestionnaireResponseForm(props: Pick<Props, 'questionnaireLoader'> & Partial<Props>) {
    return (
        <FHIRQuestionnaireResponseForm
            {...props}
            serviceProvider={
                props.serviceProvider ?? {
                    service,
                }
            }
            fhirService={props.fhirService ?? service}
            sdcServiceProvider={{
                service: props.sdcServiceProvider?.service ?? props.fhirService ?? service,
                assemble: props.sdcServiceProvider?.assemble ?? props.fhirService ?? service,
                constraintCheck: props.sdcServiceProvider?.constraintCheck ?? props.fhirService ?? service,
                populate: props.sdcServiceProvider?.populate ?? props.fhirService ?? service,
                extract: props.sdcServiceProvider?.extract ?? props.fhirService ?? service,
                saveQuestionnaireResponse:
                    props.sdcServiceProvider?.saveQuestionnaireResponse ?? persistSaveQuestionnaireReponseService,
            }}
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
