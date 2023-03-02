import type { PickerTimeProps, RangePickerTimeProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';
import { forwardRef } from 'react';

import { DatePicker } from 'src/components/DatePicker';

interface TimePickerProps extends Omit<PickerTimeProps<moment.Moment>, 'picker'> {}

export const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => (
    <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

interface RangeTimePickerProps extends Omit<RangePickerTimeProps<moment.Moment>, 'picker'> {}

export const RangeTimePicker = forwardRef<any, RangeTimePickerProps>((props, ref) => (
    <DatePicker.RangePicker {...props} picker="time" mode={undefined} ref={ref} />
));
