import { Form, Slider } from 'antd';
import type { SliderMarks } from 'antd/es/slider';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

const inputStyle = { backgroundColor: '#F7F9FC' };

interface QuestionSliderExtensions {
    start?: number;
    stop?: number;
    startLabel?: string;
    stopLabel?: string;
    sliderStepValue?: number;
}

export function QuestionSlider({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const { start, stop, startLabel, stopLabel, sliderStepValue } =
        questionItem as QuestionSliderExtensions;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    if (typeof start === 'undefined' || typeof stop === 'undefined') {
        return <p>Start and stop boundaries is required for slider</p>;
    }

    const marks: SliderMarks = {
        [start]: startLabel ?? start.toString(),
        [stop]: stopLabel ?? stop.toString(),
    };

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <Slider
                style={inputStyle}
                disabled={readOnly || qrfContext.readOnly}
                marks={marks}
                min={start}
                max={stop}
                step={sliderStepValue ?? 1}
            />
        </Form.Item>
    );
}
