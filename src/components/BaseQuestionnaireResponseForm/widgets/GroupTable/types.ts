import { FCEQuestionnaireItem, FormAnswerItems, FormGroupItems } from 'sdc-qrf';

export interface GroupTableItem {
    linkId: string;
    index: number;
    formItem?: FormGroupItems | (FormAnswerItems | undefined)[] | undefined;
    questionnaireItem?: FCEQuestionnaireItem | undefined;
}

export type GroupTableRow = Record<string, GroupTableItem> & { key: string };
