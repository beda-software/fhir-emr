import { FCEQuestionnaireItem, FormItems } from 'sdc-qrf';

export interface RepeatableGroupTableRow {
    key: string;
    linkId: string;
    index: number;
    itemKey: string;
    formItem?: FormItems;
    questionnaireItem?: FCEQuestionnaireItem | undefined;
}
