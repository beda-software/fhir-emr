import { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { getFieldErrorMessage } from 'src/components/BaseQuestionnaireResponseForm/utils';
import { describe } from 'vitest';

describe('Field error message should be relevant and human readable', () => {
    test('fieldErrorMessage', () => {
        const field: ControllerRenderProps<FieldValues, any> = {
            name: 'first-name.0.value.string',
            value: 'NotSoLongReallyName',
            onChange: () => {},
            onBlur: () => {},
            ref: () => {},
        };

        const fieldState: ControllerFieldState = {
            error: {
                message: 'first-name.0.value.string must be at most 10 characters',
                type: 'max',
            },
            invalid: true,
            isTouched: true,
            isDirty: true,
            isValidating: false,
        };

        const fieldName = 'First name';

        const invalidFieldMessage = getFieldErrorMessage(field, fieldState, fieldName);

        expect(invalidFieldMessage).toBe('First name must be at most 10 characters');
    });
});
