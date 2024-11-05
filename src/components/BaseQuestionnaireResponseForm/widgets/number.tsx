import { Form, InputNumber, Select } from 'antd';
import { Coding } from 'fhir/r4b';
import { useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

const inputStyle = { width: '100%' };

interface NumericItem {
    unit?: Coding;
}

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, required } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <InputNumber
                addonAfter={unit?.display}
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
                required={required}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <InputNumber
                addonAfter={unit?.display}
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export function QuestionQuantity(props: QuestionItemProps) {
    const { parentPath, questionItem } = props;

    const { linkId } = questionItem;
    const { unitOption } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    const [selectedUnit, setSelectedUnit] = useState(unitOption?.[0]?.display);

    return (
        <Form.Item {...formItem}>
            <InputNumber
                addonAfter={
                    unitOption && unitOption.length > 1 ? (
                        <Select
                            value={selectedUnit}
                            onChange={setSelectedUnit}
                            style={{ minWidth: 70 }}
                            disabled={disabled}
                        >
                            {unitOption.map((option, index) => (
                                <Select.Option key={index} value={option.display}>
                                    {option.display}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        unitOption?.[0]?.display
                    )
                }
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}
