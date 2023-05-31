import { FHIRTimeFormat } from 'fhir-react/lib/utils/date';
import { useCallback } from 'react';
import { GroupItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { RangeValue } from 'src/components/TimePicker/types';

export function useTimeRangePickerControl(props: GroupItemProps) {
    const { questionItem } = props;

    const startTimeItem = questionItem.item![0]!;
    const startTimeItemFieldName = [questionItem.linkId, 'items', startTimeItem.linkId, 0];
    const {
        onChange: startTimeOnChange,
        value: startTimeFieldValue,
        formItem: startFormItem,
    } = useFieldController(startTimeItemFieldName, startTimeItem);

    const endTimeItem = questionItem.item![1]!;
    const endTimeItemFieldName = [questionItem.linkId, 'items', endTimeItem.linkId, 0];
    const {
        onChange: endTimeOnChange,
        value: endTimeFieldValue,
        formItem: endFormItem,
    } = useFieldController(endTimeItemFieldName, endTimeItem);

    const onTimeRangeChange = useCallback(
        (rangeValue: RangeValue) => {
            if (rangeValue) {
                startTimeOnChange({ value: { time: rangeValue[0]!.format(FHIRTimeFormat) } });
                endTimeOnChange({ value: { time: rangeValue[1]!.format(FHIRTimeFormat) } });
            }
        },
        [startTimeOnChange, endTimeOnChange],
    );

    return { onTimeRangeChange, startTimeFieldValue, endTimeFieldValue, startFormItem, endFormItem };
}
