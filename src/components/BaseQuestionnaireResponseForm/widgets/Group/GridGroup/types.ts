import { GroupItemProps } from 'sdc-qrf';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

export interface GridGroupProps {
    groupItem: GroupItemProps;
}

export interface GridMap {
    columns: QuestionnaireItem['text'][];
    groups: GroupMap[];
}

export interface GroupMap {
    group: QuestionnaireItem;
    items: (QuestionnaireItem | undefined)[];
}
