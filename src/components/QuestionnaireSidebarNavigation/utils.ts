import { FCEQuestionnaireItem } from 'sdc-qrf';

import { AnchorItem } from './types';

export function getAnchorItemData(item: FCEQuestionnaireItem[]): AnchorItem[] {
    return item.reduce<AnchorItem[]>((acc, item) => {
        if (item.type !== 'group' || !item.text || !item.item?.length) {
            return acc;
        }

        return [
            ...acc,
            {
                key: item.linkId,
                href: `#group-${item.linkId}`,
                title: item.text,
                ...(item.item && { children: getAnchorItemData(item.item) }),
            },
        ];
    }, []);
}
