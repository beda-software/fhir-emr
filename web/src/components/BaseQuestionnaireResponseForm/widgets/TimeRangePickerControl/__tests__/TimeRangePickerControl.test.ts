import { act, renderHook } from '@testing-library/react';
import { FHIRTimeFormat } from 'fhir-react/lib/utils/date';
import moment from 'moment';
import { GroupItemProps } from 'sdc-qrf';

import { useTimeRangePickerControl } from '../hooks';

const mockControllerFieldOnChange = jest.fn();
jest.mock('react-hook-form', () => ({
    useFormContext: () => ({
        control: {},
    }),
    useController: () => ({
        field: { value: 'test', onChange: mockControllerFieldOnChange },
    }),
}));

describe('TimeRangePickerControl', () => {
    test('returns correct start and end time when range is changed', () => {
        const start = moment('01-01-2023');
        const end = moment('20-01-2023');

        const timeRangePickerControlProps: GroupItemProps = {
            questionItem: {
                item: [
                    {
                        type: 'time',
                        linkId: 'start-time',
                    },
                    {
                        type: 'time',
                        linkId: 'end-time',
                    },
                ],
                text: 'Time',
                type: 'group',
                linkId: 'Time period',
                itemControl: {
                    coding: [
                        {
                            code: 'time-range-picker',
                        },
                    ],
                },
            },
            context: [],
            parentPath: [],
        };

        const { result } = renderHook(() => useTimeRangePickerControl(timeRangePickerControlProps));

        act(() => {
            result.current.onTimeRangeChange([start, end]);
        });

        expect(mockControllerFieldOnChange).toHaveBeenCalledTimes(2);
        expect(mockControllerFieldOnChange).toHaveBeenCalledWith({
            value: { time: start.format(FHIRTimeFormat) },
        });
        expect(mockControllerFieldOnChange).toHaveBeenCalledWith({
            value: { time: end.format(FHIRTimeFormat) },
        });
    });
});
