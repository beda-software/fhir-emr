import { FCEQuestionnaireItem, FormAnswerItems, FormGroupItems } from 'sdc-qrf';

export interface RenderFormItemReadOnlyProps {
    formItem: FormGroupItems | (FormAnswerItems | undefined)[] | undefined;
    questionnaireItem: FCEQuestionnaireItem | undefined | null;
}

export interface RenderRow {
    depth: number;
    label: string;
    value: string;
    isMarkdown: boolean;
}
