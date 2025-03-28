import { Form } from 'antd';
import moment, { type Moment } from 'moment';
import { useCallback, useMemo } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { FHIRTimeFormat, formatFHIRDate, formatFHIRDateTime, formatFHIRTime } from '@beda.software/fhir-react';

import { DatePicker } from 'src/components/DatePicker';
import { TimePicker } from 'src/components/TimePicker';
import { humanDate, humanDateTime, humanTime } from 'src/utils/date';

import { useFieldController } from '../hooks';

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, type, regex } = questionItem;
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
                format={regex}
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
    format?: string;
}

function DateTimePickerWrapper(props: DateTimePickerWrapperProps) {
    const { value, onChange, type, disabled, placeholder, format } = props;

    const newValue = useMemo(() => {
        if (!value) {
            return undefined;
        }

        if (type === 'time') {
            return moment(value, FHIRTimeFormat, true);
        }

        return moment(value);
    }, [value, type]);

    let resultFormat: string;
    let showTime: boolean | object;
    let formatFunction: (value: Moment) => string;

    if (type === 'date') {
        resultFormat = format || humanDate;
        showTime = false;
        formatFunction = formatFHIRDate;
    } else if (type === 'time') {
        resultFormat = format || humanTime;
        showTime = { format: resultFormat };
        formatFunction = formatFHIRTime;
    } else {
        resultFormat = format || humanDateTime;
        showTime = { format: resultFormat };
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
                format={resultFormat}
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
            format={resultFormat}
            value={newValue}
            disabled={disabled}
            placeholder={placeholder}
        />
    );
}
