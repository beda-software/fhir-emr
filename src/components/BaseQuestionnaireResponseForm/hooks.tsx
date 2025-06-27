import { FormItemProps } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FCEQuestionnaireItem, FormAnswerItems, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { getFieldErrorMessage } from 'src/components/BaseQuestionnaireResponseForm/utils';

import s from './BaseQuestionnaireResponseForm.module.scss';
import { FieldLabel } from './FieldLabel';

export function useFieldController<T = unknown>(fieldName: any, questionItem: FCEQuestionnaireItem) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { readOnly, hidden, repeats, text, required, entryFormat, helpText } = questionItem;
    // @ts-ignore we can use array as value
    const { control } = useFormContext<T>();

    const isGroup = !!questionItem.item;
    const defaultValue = isGroup ? { items: [] } : [];

    // @ts-ignore we can use array as value
    const { field, fieldState } = useController<T>({
        control,
        name: fieldName.join('.'),
        ...(repeats ? { defaultValue } : {}),
    });

    const invalidFieldMessage = getFieldErrorMessage(field, fieldState, text);

    const formItem: FormItemProps = {
        label: <FieldLabel questionItem={questionItem} />,
        hidden: hidden,
        validateStatus: fieldState?.invalid ? 'error' : 'success',
        help: invalidFieldMessage,
        required,
        className: classNames(s.field, {
            [s._hidden]: hidden,
        }),
    };

    const onMultiChange = useCallback(
        (option: FormAnswerItems) => {
            // NOTE: it's used online in inline-choice
            if (repeats) {
                const formAnswers = (field.value ?? []) as FormAnswerItems[];
                const valueIndex = formAnswers.findIndex((v) => _.isEqual(v.value, option.value));

                if (valueIndex === -1) {
                    field.onChange([...formAnswers, option]);
                } else {
                    formAnswers.splice(valueIndex, 1);
                    field.onChange(formAnswers);
                }
            } else {
                field.onChange([option]);
            }
        },
        [repeats, field],
    );

    // This is a wrapper for react-select that always wrap single value into array
    // @ts-ignore It's hard to define proper type of onSelect
    const onSelect = useCallback((option: any) => field.onChange([].concat(option)), [field]);

    return {
        ...field,
        value: field.value as T | undefined,
        onMultiChange,
        onSelect,
        fieldState,
        disabled: readOnly || qrfContext.readOnly,
        formItem,
        placeholder: entryFormat,
        helpText,
    };
}
