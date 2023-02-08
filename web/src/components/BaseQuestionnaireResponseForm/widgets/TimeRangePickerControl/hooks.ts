import { FHIRTimeFormat } from 'aidbox-react/lib/utils/date';
import { useCallback } from 'react';
import { GroupItemProps } from 'sdc-qrf';

import { RangeValue } from 'src/components/TimePicker/types';
import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

export function useTimeRangePickerControl(props: GroupItemProps) {
    const { questionItem } = props;

    const startTimeItem = questionItem.item![0]!;
    const startTimeItemFieldName = [questionItem.linkId, 'items', startTimeItem.linkId, 0];
    const { onChange: startTimeOnChange, value: startTimeFieldValue } = useFieldController(
        startTimeItemFieldName,
        startTimeItem,
    );

    const endTimeItem = questionItem.item![1]!;
    const endTimeItemFieldName = [questionItem.linkId, 'items', endTimeItem.linkId, 0];
    const { onChange: endTimeOnChange, value: endTimeFieldValue } = useFieldController(
        endTimeItemFieldName,
        endTimeItem,
    );

    const onTimeRangeChange = useCallback(
        (rangeValue: RangeValue) => {
            if (rangeValue) {
                startTimeOnChange({ value: { string: rangeValue[0]!.format(FHIRTimeFormat) } });
                endTimeOnChange({ value: { string: rangeValue[1]!.format(FHIRTimeFormat) } });
            }
        },
        [startTimeOnChange, endTimeOnChange],
    );

    return { onTimeRangeChange, startTimeFieldValue, endTimeFieldValue };
}
