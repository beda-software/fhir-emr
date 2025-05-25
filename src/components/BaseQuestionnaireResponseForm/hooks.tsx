import { FormItemProps } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FormAnswerItems, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

import { getFieldErrorMessage } from 'src/components/BaseQuestionnaireResponseForm/utils';

import s from './BaseQuestionnaireResponseForm.module.scss';
import { FieldLabel } from './FieldLabel';

export function useFieldController<T = unknown>(fieldName: any, questionItem: QuestionnaireItem) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { readOnly, hidden, repeats, text, required, entryFormat, helpText } = questionItem;
    const { control } = useFormContext();

    // @ts-ignore, T might be array
    const { field, fieldState } = useController<T>({
        control: control,
        name: fieldName.join('.'),
        ...(repeats ? { defaultValue: [] } : {}),
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
                const arrayValue = (field.value ?? []) as any[];
                const valueIndex = arrayValue.findIndex((v) => _.isEqual(v?.value, option.value));

                if (valueIndex === -1) {
                    field.onChange([...arrayValue, option]);
                } else {
                    arrayValue.splice(valueIndex, 1);
                    field.onChange(arrayValue);
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
