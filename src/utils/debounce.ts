import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [JSON.stringify(value), delay]);

    return debouncedValue;
}

export function useDebouncedInput<T, E>(props: {
    onChange: (event: E) => void;
    getValue: (event: E) => T;
    initialValue: T;
}) {
    const { onChange, getValue, initialValue } = props;

    const [valueInput, setValueInput] = useState<T>(initialValue);

    const debouncedOnChange = useCallback(
        _.debounce((event: E) => {
            onChange(event);
        }, 300),
        [onChange],
    );

    const handleChange = (event: E) => {
        const valueInput = getValue(event);

        setValueInput(valueInput);

        debouncedOnChange(event);
    };

    return {
        valueInput,
        handleChange,
    };
}
