import { FHIRTimeFormat } from 'aidbox-react/lib/utils/date';
import { useCallback, useEffect, useState } from 'react';
import { GroupItemProps } from 'sdc-qrf';

import { RangeValue } from 'src/components/TimePicker/types';
import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { TimeRangePickerGroupItemProps, ValueString } from './types';

export function useTimeRangePickerControl(props: GroupItemProps) {
    const { questionItem, parentPath } = props;

    const [startTime, setStartTime] = useState<ValueString | undefined>(undefined);
    const [endTime, setEndTime] = useState<ValueString | undefined>(undefined);

    const fieldName = [...parentPath, questionItem.linkId];

    const onTimeRangeChange = useCallback(
        (rangeValue: RangeValue) => {
            if (rangeValue) {
                setStartTime({ value: { string: rangeValue[0]!.format(FHIRTimeFormat) } });
                setEndTime({ value: { string: rangeValue[1]!.format(FHIRTimeFormat) } });
            }
        },
        [setStartTime, setEndTime],
    );

    return { onTimeRangeChange, fieldName, startTime, endTime };
}

export function useTimeRangePickerGroupItem(props: TimeRangePickerGroupItemProps) {
    const { questionItem, parentPath, value } = props;

    const fieldName = [...parentPath, 'items', questionItem.linkId, 0];

    const { onChange } = useFieldController(fieldName, questionItem);

    useEffect(() => {
        onChange(value);
    }, [value]);
}
