import { FCEQuestionnaireItem, GroupItemProps } from 'sdc-qrf';

export interface GridGroupProps {
    groupItem: GroupItemProps;
}

export interface GridMap {
    columns: FCEQuestionnaireItem['text'][];
    groups: GroupMap[];
}

export interface GroupMap {
    group: FCEQuestionnaireItem;
    items: (FCEQuestionnaireItem | undefined)[];
}
