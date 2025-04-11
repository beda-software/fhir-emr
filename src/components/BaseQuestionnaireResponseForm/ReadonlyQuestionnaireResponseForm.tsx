import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    calcInitialContext,
    FormItems,
    QRFContextData,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';

import {
    ItemControlGroupItemReadonlyWidgetsContext,
    ItemControlQuestionItemReadonlyWidgetsContext,
} from 'src/components/BaseQuestionnaireResponseForm/context';
import { MarkdownRenderControl } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/MarkdownRender';

import { AudioAttachment } from './readonly-widgets/AudioAttachment';
import { QuestionBoolean } from './readonly-widgets/boolean';
import { QuestionChoice } from './readonly-widgets/choice';
import { QuestionDateTime } from './readonly-widgets/date';
import { Display } from './readonly-widgets/display';
import { Col, Group, Row } from './readonly-widgets/Group';
import { NavigationGroup } from './readonly-widgets/Group/NavigationGroup';
import { QuestionInteger, QuestionDecimal, QuestionQuantity } from './readonly-widgets/number';
import { QuestionReference } from './readonly-widgets/reference';
import { AnxietyScore, DepressionScore } from './readonly-widgets/score';
import { QuestionText, TextWithInput } from './readonly-widgets/string';
import { TimeRangePickerControl } from './readonly-widgets/TimeRangePickerControl';
import { UploadFile } from './readonly-widgets/UploadFile';

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

    const ItemControlQuestionItemReadonlyWidgetsFromContext = useContext(ItemControlQuestionItemReadonlyWidgetsContext);
    const ItemControlGroupItemReadonlyWidgetsFromContext = useContext(ItemControlGroupItemReadonlyWidgetsContext);

    return (
        <FormProvider {...methods}>
            <form>
                <QuestionnaireResponseFormProvider
                    {...other}
                    formValues={formValues}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    setFormValues={() => {}}
                    groupItemComponent={Group}
                    itemControlGroupItemComponents={{
                        col: Col,
                        row: Row,
                        'time-range-picker': TimeRangePickerControl,
                        'wizard-navigation-group': NavigationGroup,
                        ...itemControlGroupItemComponents,
                        ...ItemControlGroupItemReadonlyWidgetsFromContext,
                    }}
                    questionItemComponents={{
                        text: QuestionText,
                        string: QuestionText,
                        integer: QuestionInteger,
                        decimal: QuestionDecimal,
                        quantity: QuestionQuantity,
                        choice: QuestionChoice,
                        date: QuestionDateTime,
                        dateTime: QuestionDateTime,
                        reference: QuestionReference,
                        display: Display,
                        boolean: QuestionBoolean,
                        attachment: UploadFile,
                        ...questionItemComponents,
                    }}
                    itemControlQuestionItemComponents={{
                        'inline-choice': QuestionChoice,
                        'anxiety-score': AnxietyScore,
                        'depression-score': DepressionScore,
                        'input-inside-text': TextWithInput,
                        'audio-recorder-uploader': AudioAttachment,
                        'markdown-editor': MarkdownRenderControl,
                        ...itemControlQuestionItemComponents,
                        ...ItemControlQuestionItemReadonlyWidgetsFromContext,
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
