import { Form } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { FHIRTimeFormat } from 'aidbox-react/lib/utils/date';

import { RangeTimePicker } from 'src/components/TimePicker';

import { useTimeRangePickerControl, useTimeRangePickerGroupItem } from './hooks';
import { TimeRangePickerGroupItemProps } from './types';

export function TimeRangePickerControl(props: GroupItemProps) {
    const { questionItem } = props;

    const { onTimeRangeChange, fieldName, startTime, endTime } = useTimeRangePickerControl(props);

    if (questionItem.item === undefined || questionItem.item.length !== 2) {
        return <p>Time range picker require exactly two children</p>;
    }

    const [startTimeItem, endTimeItem] = questionItem.item;

    return (
        <Form.Item label={questionItem.text} hidden={questionItem.hidden}>
            <RangeTimePicker
                format={FHIRTimeFormat}
                disabled={questionItem.readOnly}
                onChange={onTimeRangeChange}
            />

            <TimeRangePickerGroupItem
                questionItem={startTimeItem!}
                parentPath={fieldName}
                value={startTime}
            />
            <TimeRangePickerGroupItem
                questionItem={endTimeItem!}
                parentPath={fieldName}
                value={endTime}
            />
        </Form.Item>
    );
}

function TimeRangePickerGroupItem(props: TimeRangePickerGroupItemProps) {
    useTimeRangePickerGroupItem(props);

    return null;
}
