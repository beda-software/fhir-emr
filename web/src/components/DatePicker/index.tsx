import generatePicker from 'antd/es/date-picker/generatePicker';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';

export const DatePicker = generatePicker<moment.Moment>(momentGenerateConfig);
