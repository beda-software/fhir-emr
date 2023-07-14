import { FormItemProps } from 'antd';
import _ from 'lodash';
import { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

export function useFieldController(fieldName: any, questionItem: QuestionnaireItem) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { readOnly, hidden, repeats, text, required } = questionItem;
    const { control } = useFormContext();

    const { field, fieldState } = useController({
        control: control,
        name: fieldName.join('.'),
        ...(repeats ? { defaultValue: [] } : {}),
    });
    const formItem: FormItemProps = {
        label: text,
        hidden: hidden,
        validateStatus: fieldState?.invalid ? 'error' : 'success',
        help: fieldState?.invalid && `${text} is required`,
        required,
    };

    const onMultiChange = useCallback(
        (option: any) => {
            if (repeats) {
                let arrayValue = (field.value ?? []) as any[];
                const valueIndex = arrayValue.findIndex((v) => _.isEqual(v?.value, option.value));

                if (valueIndex === -1) {
                    field.onChange([...arrayValue, option]);
                } else {
                    arrayValue.splice(valueIndex, 1);
                    field.onChange(arrayValue);
                }
            } else {
                field.onChange(option);
            }
        },
        [repeats, field],
    );

    return {
        ...field,
        onMultiChange,
        fieldState,
        disabled: readOnly || qrfContext.readOnly,
        formItem,
    };
}
