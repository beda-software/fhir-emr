import { QuestionnaireItem } from '@beda.software/aidbox-types';

export type ValueString = { value: { string: string } };

export interface TimeRangePickerGroupItemProps {
    questionItem: QuestionnaireItem;
    parentPath: (string | number)[];
    value?: ValueString;
}
