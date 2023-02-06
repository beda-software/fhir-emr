import moment from 'moment';
import { act, renderHook } from '@testing-library/react';
import { GroupItemProps } from 'sdc-qrf';
import { FHIRTimeFormat } from 'aidbox-react/lib/utils/date';

import { useTimeRangePickerControl } from '../hooks';

describe('TimeRangePickerControl', () => {
    it('returns correct start and end time when range is changed', () => {
        const start = moment('01-01-2023');
        const end = moment('20-01-2023');

        const timeRangePickerControlProps: GroupItemProps = {
            questionItem: {
                type: 'group',
                linkId: 'timeRangePicker',
            },
            context: [],
            parentPath: [],
        };

        const { result } = renderHook(() => useTimeRangePickerControl(timeRangePickerControlProps));

        act(() => {
            result.current.onTimeRangeChange([start, end]);
        });

        expect(result.current.startTime).toEqual({
            value: { string: start.format(FHIRTimeFormat) },
        });
        expect(result.current.endTime).toEqual({ value: { string: end.format(FHIRTimeFormat) } });
    });
});
