import {
    UseControllerReturn,
    UseFieldArrayReturn,
    useController,
    useFieldArray,
    useFormContext,
} from 'react-hook-form';

interface SettingsFieldProps {
    name: string;
    children: (props: UseControllerReturn) => React.ReactNode;
}

function useFieldController(name: string): UseControllerReturn {
    const { control } = useFormContext();

    const result = useController({
        control: control,
        name,
    });

    return result;
}

export function SettingsField({ name, children }: SettingsFieldProps) {
    const props = useFieldController(name);

    return <>{children?.(props)}</>;
}

interface SettingsFieldArrayProps {
    name: string;
    children: (props: UseFieldArrayReturn) => React.ReactNode;
}

function useFieldArrayController(name: string): UseFieldArrayReturn {
    const { control } = useFormContext();

    const result = useFieldArray({
        control: control,
        name,
    });

    return result;
}

export function SettingsFieldArray({ name, children }: SettingsFieldArrayProps) {
    const props = useFieldArrayController(name);

    return <>{children?.(props)}</>;
}
