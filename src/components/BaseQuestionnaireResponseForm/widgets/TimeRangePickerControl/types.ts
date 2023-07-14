import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

export type ValueString = { value: { string: string } };

export interface TimeRangePickerGroupItemProps {
    questionItem: QuestionnaireItem;
    parentPath: (string | number)[];
    value?: ValueString;
}
