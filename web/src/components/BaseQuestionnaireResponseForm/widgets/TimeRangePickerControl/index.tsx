import { Form } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { RangeTimePicker } from 'src/components/TimePicker';

import { useTimeRangePickerControl } from './hooks';

export function TimeRangePickerControl(props: GroupItemProps) {
    const { questionItem } = props;

    if (questionItem.item?.length !== 2) {
        return <p>Time range picker require exactly two children</p>;
    }

    return <TimeRangePickerWidget {...props} />;
}

function TimeRangePickerWidget(props: GroupItemProps) {
    const { questionItem } = props;

    const { onTimeRangeChange, startFormItem, endFormItem } = useTimeRangePickerControl(props);

    return (
        <Form.Item {...startFormItem} {...endFormItem} label={questionItem.text} hidden={questionItem.hidden}>
            <RangeTimePicker format="HH:mm" disabled={questionItem.readOnly} onChange={onTimeRangeChange} />
        </Form.Item>
    );
}
