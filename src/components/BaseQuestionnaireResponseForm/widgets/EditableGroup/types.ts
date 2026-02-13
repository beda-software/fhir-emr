import { FCEQuestionnaireItem, FormAnswerItems, FormGroupItems } from 'sdc-qrf';

export interface EditableGroupTableItem {
    linkId: string;
    formItem?: FormGroupItems | (FormAnswerItems | undefined)[] | undefined;
    questionnaireItem?: FCEQuestionnaireItem | undefined;
}

export type EditableGroupTableRow = Record<string, EditableGroupTableItem> & { key: string };
