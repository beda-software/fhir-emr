import { CSSProperties } from 'react';
import { FCEQuestionnaireItem, FormAnswerItems, FormGroupItems, GroupItemProps } from 'sdc-qrf';

export interface GroupTableItem {
    linkId: string;
    index: number;
    formItem?: FormGroupItems | (FormAnswerItems | undefined)[] | undefined;
    questionnaireItem?: FCEQuestionnaireItem | undefined;
}

export type GroupTableRow = Record<string, GroupTableItem> & { key: string };

export type ChartHighlightArea = {
    from?: number;
    to?: number;
    color?: string;
};

export interface GroupTableProps extends GroupItemProps {
    chartHeight?: number;
    tickCSSProperties?: CSSProperties;
    labelCSSProperties?: CSSProperties;
}
