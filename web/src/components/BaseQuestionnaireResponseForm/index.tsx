import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import {
    calcInitialContext,
    FormItems,
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';

import 'react-phone-input-2/lib/style.css';
import s from './BaseQuestionnaireResponseForm.module.scss';
import {
    Col,
    Group,
    InlineChoice,
    PairInput,
    TimeRangePickerControl,
    QuestionBoolean,
    QuestionChoice,
    QuestionDateTime,
    QuestionDecimal,
    QuestionInteger,
    QuestionPhone,
    QuestionSlider,
    QuestionSolidRadio,
    QuestionString,
    QuestionText,
    Row,
    PractitionerRoleList,
} from './widgets';
import { Display } from './widgets/display';
import { QuestionReference } from './widgets/reference';

export interface BaseQuestionnaireResponseFormProps {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    questionItemComponents?: QuestionItemComponentMapping;
    groupItemComponent?: GroupItemComponent;
    onCancel?: () => void;
}

export function BaseQuestionnaireResponseForm(props: BaseQuestionnaireResponseFormProps) {
    const { onSubmit, formData, readOnly, onCancel } = props;
    const methods = useForm<FormItems>({
        defaultValues: formData.formValues,
    });
    const { setValue, handleSubmit, watch } = methods;

    const formValues = watch();

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(() => onSubmit({ ...formData, formValues }))}
                className={s.form}
            >
                <QuestionnaireResponseFormProvider
                    formValues={formValues}
                    setFormValues={(values, fieldPath, value) =>
                        setValue(fieldPath.join('.'), value)
                    }
                    groupItemComponent={Group}
                    itemControlGroupItemComponents={{
                        col: Col,
                        row: Row,
                        'pair-input': PairInput,
                        'time-range-picker': TimeRangePickerControl,
                        ...props.itemControlGroupItemComponents,
                    }}
                    questionItemComponents={{
                        text: QuestionText,
                        string: QuestionString,
                        decimal: QuestionDecimal,
                        integer: QuestionInteger,
                        date: QuestionDateTime,
                        dateTime: QuestionDateTime,
                        time: QuestionDateTime,
                        choice: QuestionChoice,
                        boolean: QuestionBoolean,
                        display: Display,
                        reference: QuestionReference,
                        ...props.questionItemComponents,
                    }}
                    itemControlQuestionItemComponents={{
                        phoneWidget: QuestionPhone,
                        slider: QuestionSlider,
                        'solid-radio-button': QuestionSolidRadio,
                        'inline-choice': InlineChoice,
                        'practitioner-role': PractitionerRoleList,
                        ...props.itemControlQuestionItemComponents,
                    }}
                    readOnly={readOnly}
                >
                    <>
                        <QuestionItems
                            questionItems={formData.context.questionnaire.item!}
                            parentPath={[]}
                            context={calcInitialContext(formData.context, formValues)}
                        />
                        {!readOnly && (
                            <div className={s.footer}>
                                {onCancel && (
                                    <Button key="back" onClick={onCancel}>
                                        <Trans>Cancel</Trans>
                                    </Button>
                                )}
                                <Button type="primary" htmlType="submit">
                                    <Trans>Save</Trans>
                                </Button>
                            </div>
                        )}
                    </>
                </QuestionnaireResponseFormProvider>
            </form>
        </FormProvider>
    );
}
