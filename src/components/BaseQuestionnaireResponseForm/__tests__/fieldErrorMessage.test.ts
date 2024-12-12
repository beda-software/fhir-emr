import { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { describe } from 'vitest';

import { getFieldErrorMessage } from 'src/components/BaseQuestionnaireResponseForm/utils';

const FIELD_STATE_MESSAGE_MAP = [
    {
        fieldName: 'first-name.0.value.string',
        fieldValue: 'NotSoLongReallyName',
        fieldText: 'First name',
        errorMessage: 'first-name[0].value.string must be at most 30 characters',
        errorType: 'max',
        expectedResult: 'First name must be at most 30 characters',
    },
    {
        fieldName: 'first-name.0.value.string',
        fieldValue: 'Basic - 1',
        fieldText: 'First name',
        errorMessage: 'first-name[0].value.string is a required field',
        errorType: 'required',
        expectedResult: 'First name is a required field',
    },
];

describe('Field error message should be relevant and human readable', () => {
    test.each(FIELD_STATE_MESSAGE_MAP)(
        'getFieldErrorMessage returns correctly transformed message',
        (fieldStateMessage) => {
            const field: ControllerRenderProps<FieldValues, any> = {
                name: fieldStateMessage.fieldName,
                value: fieldStateMessage.fieldValue,
                onChange: () => {
                    return void 0;
                },
                onBlur: () => {
                    return void 0;
                },
                ref: () => {
                    return void 0;
                },
            };

            const fieldState: ControllerFieldState = {
                error: {
                    message: fieldStateMessage.errorMessage,
                    type: fieldStateMessage.errorType,
                },
                invalid: true,
                isTouched: true,
                isValidating: true,
                isDirty: true,
            };

            const fieldText = fieldStateMessage.fieldText;

            const invalidFieldMessage = getFieldErrorMessage(field, fieldState, fieldText);

            expect(invalidFieldMessage).toBe(fieldStateMessage.expectedResult);
        },
    );
});
