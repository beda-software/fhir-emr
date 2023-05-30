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
    const { linkId } = questionItem;
    const { start, stop, startLabel, stopLabel, sliderStepValue, helpText } = questionItem as QuestionSliderExtensions;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    if (typeof start === 'undefined' || typeof stop === 'undefined') {
        return <p>Start and stop boundaries is required for slider</p>;
    }

    const marks: SliderMarks = {
        [start]: startLabel ?? start.toString(),
        [stop]: stopLabel ?? stop.toString(),
    };

    return (
        <Form.Item {...formItem}>
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
