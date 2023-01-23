import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from 'shared/src/contrib/aidbox';

export function useFieldController(fieldName: any, questionItem: QuestionnaireItem) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { readOnly, hidden, repeats } = questionItem;
    const { control } = useFormContext();

    const { field } = useController({
        control: control,
        name: fieldName.join('.'),
        // defaultValue: [repeats ? [] : undefined]
        ...(repeats ? { defaultValue: [] } : {}),
    });

    const onChange = useCallback(
        (option: any) => {
            if (repeats) {
                const arrayValue = (field.value || []) as QuestionnaireItemAnswerOption[];
                const valueIndex = arrayValue.findIndex((v) => _.isEqual(v?.value, option.value));

                if (valueIndex === -1) {
                    field.onChange([...arrayValue, option]);
                } else {
                    const filteredValues = arrayValue.filter(
                        (v) => !_.isEqual(v?.value, option.value),
                    );
                    field.onChange(filteredValues);
                }
            } else {
                field.onChange(option);
            }
        },
        [repeats, field],
    );

    return { ...field, onChange, hidden, disabled: readOnly || qrfContext.readOnly };
}
