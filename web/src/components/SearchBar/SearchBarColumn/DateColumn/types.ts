import moment from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker';

export type RangePickerOnChange = Exclude<RangePickerProps<moment.Moment>['onChange'], undefined>;
