import { GroupItemProps } from 'sdc-qrf';

import { getAnchorItemData } from './utils';

export function useQuestionnaireSidebarNavigation(props: GroupItemProps) {
    const { questionItem } = props;
    const { item } = questionItem;

    const anchorItems = item ? getAnchorItemData(item) : [];

    return { anchorItems };
}
