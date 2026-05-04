import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';
import { FCEQuestionnaire } from 'sdc-qrf';

export function getFieldErrorMessage(
    field: ControllerRenderProps<any, any>,
    fieldState: ControllerFieldState,
    text?: string,
) {
    if (!fieldState || !fieldState.invalid) {
        return undefined;
    }

    if (!fieldState.error || !fieldState.error.message) {
        return undefined;
    }
    // replace [0], [1] with .0, .1 to match field.name
    const errorMessageWithInternalFieldName = fieldState.error.message.replace(/\[(\d+)\]/g, '.$1');

    const errorMessageWithHumanReadableFieldName = errorMessageWithInternalFieldName.replace(field.name, text ?? '');

    return errorMessageWithHumanReadableFieldName;
}

export function isGroupWizard(q: FCEQuestionnaire) {
    return q.item?.some((i) => {
        const itemControlCode = i.itemControl?.coding?.[0]?.code;

        return (
            itemControlCode &&
            ['wizard', 'wizard-with-tooltips', 'wizard-vertical', 'wizard-navigation-group'].includes(itemControlCode)
        );
    });
}
