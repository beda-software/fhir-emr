import { Form } from 'antd';
import moment, { type Moment } from 'moment';
import { useCallback, useMemo } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { FHIRDateFormat, formatFHIRDate, formatFHIRDateTime } from '@beda.software/fhir-react';

import { DatePicker } from 'src/components/DatePicker';

import { useFieldController } from '../hooks';

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, type } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', type];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <DateTimePickerWrapper type={type} onChange={onChange} value={value} disabled={disabled} />
        </Form.Item>
    );
}

interface DateTimePickerWrapperProps {
    type: string;
    value?: string;
    onChange?: (value?: string) => void;
    disabled?: boolean;
}

function DateTimePickerWrapper({ value, onChange, type, disabled }: DateTimePickerWrapperProps) {
    const newValue = useMemo(() => (value !== undefined ? moment(value) : value), [value]);
    const format = type === 'date' ? FHIRDateFormat : 'YYYY-MM-DD HH:mm';
    const showTime = type === 'date' ? false : { format: 'HH:mm' };
    const formatFunction = type === 'date' ? formatFHIRDate : formatFHIRDateTime;

    const newOnChange = useCallback(
        (v: Moment | null, dateString: string) => {
            onChange?.(v !== null ? formatFunction(v) : undefined);
        },
        [onChange, formatFunction],
    );

    return (
        <DatePicker showTime={showTime} onChange={newOnChange} format={format} value={newValue} disabled={disabled} />
    );
}
