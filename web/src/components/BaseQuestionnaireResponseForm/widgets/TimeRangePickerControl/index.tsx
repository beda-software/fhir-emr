import { Form } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { FHIRTimeFormat } from 'aidbox-react/lib/utils/date';

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

    const { onTimeRangeChange } = useTimeRangePickerControl(props);

    return (
        <Form.Item label={questionItem.text} hidden={questionItem.hidden}>
            <RangeTimePicker
                format={FHIRTimeFormat}
                disabled={questionItem.readOnly}
                onChange={onTimeRangeChange}
            />
        </Form.Item>
    );
}
