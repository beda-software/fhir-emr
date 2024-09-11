import { Form } from 'antd';
import moment, { type Moment } from 'moment';
import { useCallback, useMemo } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import {
    FHIRDateFormat,
    FHIRTimeFormat,
    FHIRDateTimeFormat,
    formatFHIRDate,
    formatFHIRDateTime,
    formatFHIRTime,
} from '@beda.software/fhir-react';

import { DatePicker } from 'src/components/DatePicker';
import { TimePicker } from 'src/components/TimePicker';

import { useFieldController } from '../hooks';

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, type } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', type];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <DateTimePickerWrapper
                type={type}
                onChange={onChange}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

interface DateTimePickerWrapperProps {
    type: string;
    value?: string;
    onChange?: (value?: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

function DateTimePickerWrapper(props: DateTimePickerWrapperProps) {
    const { value, onChange, type, disabled, placeholder } = props;

    const newValue = useMemo(() => {
        if (!value) {
            return undefined;
        }

        if (type === 'time') {
            return moment(value, FHIRTimeFormat, true);
        }

        return moment(value);
    }, [value, type]);

    let format: string;
    let showTime: boolean | object;
    let formatFunction: (value: Moment) => string;

    if (type === 'date') {
        format = FHIRDateFormat;
        showTime = false;
        formatFunction = formatFHIRDate;
    } else if (type === 'time') {
        format = FHIRTimeFormat;
        showTime = { format: FHIRTimeFormat };
        formatFunction = formatFHIRTime;
    } else {
        format = FHIRDateTimeFormat;
        showTime = { format: FHIRDateTimeFormat };
        formatFunction = formatFHIRDateTime;
    }

    const newOnChange = useCallback(
        (v: Moment | null) => {
            onChange?.(v !== null ? formatFunction(v) : undefined);
        },
        [onChange, formatFunction],
    );

    if (type === 'time') {
        return (
            <TimePicker
                onChange={newOnChange}
                format={format}
                value={newValue}
                disabled={disabled}
                placeholder={placeholder}
            />
        );
    }

    return (
        <DatePicker
            showTime={showTime}
            onChange={newOnChange}
            format={format}
            value={newValue}
            disabled={disabled}
            placeholder={placeholder}
        />
    );
}
