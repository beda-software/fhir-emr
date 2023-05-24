import { Form, Slider } from 'antd';
import type { SliderMarks } from 'antd/es/slider';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

const inputStyle = { backgroundColor: '#F7F9FC' };

interface QuestionSliderExtensions {
    start?: number;
    stop?: number;
    startLabel?: string;
    stopLabel?: string;
    sliderStepValue?: number;
    helpText?: string;
}

export function QuestionSlider({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, required } = questionItem;
    const { start, stop, startLabel, stopLabel, sliderStepValue, helpText } = questionItem as QuestionSliderExtensions;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value, onChange, disabled, hidden, fieldState } = useFieldController(fieldName, questionItem);

    if (typeof start === 'undefined' || typeof stop === 'undefined') {
        return <p>Start and stop boundaries is required for slider</p>;
    }

    const marks: SliderMarks = {
        [start]: startLabel ?? start.toString(),
        [stop]: stopLabel ?? stop.toString(),
    };

    return (
        <Form.Item
            label={text}
            hidden={hidden}
            validateStatus={fieldState.invalid ? 'error' : 'success'}
            help={fieldState.invalid && `${text} is required`}
            required={required}
        >
            <Slider
                value={value}
                onChange={onChange}
                style={inputStyle}
                marks={marks}
                min={start}
                max={stop}
                step={sliderStepValue ?? 1}
                disabled={disabled}
            />
            <span>{helpText}</span>
        </Form.Item>
    );
}
