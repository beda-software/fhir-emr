import { RangePickerProps } from 'antd/lib/date-picker/generatePicker';
import moment from 'moment';

export type RangePickerOnChange = Exclude<RangePickerProps<moment.Moment>['onChange'], undefined>;
