import { FormProvider, useForm } from 'react-hook-form';
import {
    calcInitialContext,
    FormItems,
    QRFContextData,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';

import { QuestionChoice } from './readonly-widgets/choice';
import { QuestionDateTime } from './readonly-widgets/date';
import { Group } from './readonly-widgets/group';
import { QuestionInteger, QuestionDecimal } from './readonly-widgets/number';
import { QuestionReference } from './readonly-widgets/reference';
import { AnxietyScore, DepressionScore } from './readonly-widgets/score';
import { QuestionText } from './readonly-widgets/string';
import { TimeRangePickerControl } from './readonly-widgets/TimeRangePickerControl';

interface Props extends Partial<QRFContextData> {
    formData: QuestionnaireResponseFormData;
}

export function ReadonlyQuestionnaireResponseForm(props: Props) {
    const {
        formData,
        questionItemComponents,
        itemControlQuestionItemComponents,
        itemControlGroupItemComponents,
        ...other
    } = props;
    const methods = useForm<FormItems>({
        defaultValues: formData.formValues,
    });
    const { watch } = methods;

    const formValues = watch();

    return (
        <FormProvider {...methods}>
            <form>
                <QuestionnaireResponseFormProvider
                    {...other}
                    formValues={formValues}
                    setFormValues={() => {}}
                    groupItemComponent={Group}
                    itemControlGroupItemComponents={{
                        'time-range-picker': TimeRangePickerControl,
                        ...itemControlGroupItemComponents,
                    }}
                    questionItemComponents={{
                        text: QuestionText,
                        string: QuestionText,
                        integer: QuestionInteger,
                        decimal: QuestionDecimal,
                        choice: QuestionChoice,
                        date: QuestionDateTime,
                        dateTime: QuestionDateTime,
                        reference: QuestionReference,
                        ...questionItemComponents,
                    }}
                    itemControlQuestionItemComponents={{
                        'inline-choice': QuestionChoice,
                        'anxiety-score': AnxietyScore,
                        'depression-score': DepressionScore,
                        ...itemControlQuestionItemComponents,
                    }}
                >
                    <>
                        <QuestionItems
                            questionItems={formData.context.questionnaire.item!}
                            parentPath={[]}
                            context={calcInitialContext(formData.context, formValues)}
                        />
                    </>
                </QuestionnaireResponseFormProvider>
            </form>
        </FormProvider>
    );
}
