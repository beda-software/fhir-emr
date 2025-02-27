import { Form, InputNumber, Select } from 'antd';
import { Coding } from 'fhir/r4b';
import _ from 'lodash';
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
        <Form.Item {...formItem} data-testid={linkId}>
            <InputNumber
                addonAfter={unit?.display}
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
                required={required}
                placeholder={placeholder}
                parser={(displayValue) => _.toInteger(displayValue)}
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
        <Form.Item {...formItem} data-testid={linkId}>
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
    const { linkId, unitOption, required } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'Quantity'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    const [numericValue, setNumericValue] = useState<number | undefined>(value?.value);
    const [selectedUnit, setSelectedUnit] = useState(unitOption?.[0]);

    const onUnitChange = (unitDisplay: string) => {
        const unit = unitOption?.find((unit) => unit.display === unitDisplay);
        if (unit) {
            setSelectedUnit(unit);
            onChange({
                value: numericValue,
                unit: unit.display,
                system: unit.system,
                code: unit.code,
            });
        }
    };

    const onValueChange = (value: number | null) => {
        setNumericValue(value || undefined);
        onChange({
            value: value,
            unit: selectedUnit?.display,
            system: selectedUnit?.system,
            code: selectedUnit?.code,
        });
    };

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <InputNumber
                addonAfter={
                    unitOption && unitOption.length > 1 ? (
                        <Select
                            value={selectedUnit?.display}
                            onChange={onUnitChange}
                            style={{ minWidth: 70 }}
                            disabled={disabled}
                            popupMatchSelectWidth={false}
                        >
                            {unitOption.map((option) => (
                                <Select.Option key={option.code} value={option.display}>
                                    {option.display}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        selectedUnit?.display
                    )
                }
                style={inputStyle}
                disabled={disabled}
                onChange={onValueChange}
                value={numericValue}
                placeholder={placeholder}
                required={required}
            />
        </Form.Item>
    );
}
