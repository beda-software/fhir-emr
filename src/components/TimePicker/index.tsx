import type { PickerTimeProps, RangePickerTimeProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';
import { forwardRef } from 'react';

import { DatePicker } from 'src/components/DatePicker';

type TimePickerProps = Omit<PickerTimeProps<moment.Moment>, 'picker'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
export const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => (
    <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

type RangeTimePickerProps = Omit<RangePickerTimeProps<moment.Moment>, 'picker'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
export const RangeTimePicker = forwardRef<any, RangeTimePickerProps>((props, ref) => (
    <DatePicker.RangePicker {...props} picker="time" mode={undefined} ref={ref} />
));
