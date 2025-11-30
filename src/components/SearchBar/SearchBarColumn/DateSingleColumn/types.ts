import type { RangePickerProps } from 'antd/es/date-picker/generatePicker/interface';
import moment from 'moment';

export type RangePickerOnChange = Exclude<RangePickerProps<moment.Moment>['onChange'], undefined>;
