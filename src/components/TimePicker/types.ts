import { DatePicker } from '../DatePicker';

export type RangeValue = Parameters<NonNullable<React.ComponentProps<typeof DatePicker.RangePicker>['onChange']>>[0];
