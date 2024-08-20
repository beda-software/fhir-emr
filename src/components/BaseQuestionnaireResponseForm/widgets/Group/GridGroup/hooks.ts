import { useMemo } from 'react';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

import { GroupMap } from './types';

export function useGridGroup(item: QuestionnaireItem) {
    const gridMap = useMemo(() => {
        if (!item || item.type !== 'group' || !item.item) {
            return undefined;
        }

        const columnsSet: Set<string> = new Set();
        item.item?.forEach((group) => {
            if (group.type === 'group' && group.text && group.item) {
                group.item.forEach((question) => {
                    if (question.text) {
                        columnsSet.add(question.text);
                    }
                });
            }
        });
        const columns = Array.from(columnsSet);

        const groups = item.item!.reduce((acc, group) => {
            const result = [...acc];

            if (group.type === 'group' && group.text) {
                const groupItems = columns.map((column) => {
                    if (!group.item) {
                        return undefined;
                    }

                    const item = group.item.find((question) => question.text === column);

                    if (!item) {
                        return undefined;
                    }

                    return item.type === 'group'
                        ? item
                        : {
                              ...item,
                              text: undefined,
                          };
                });

                result.push({
                    group,
                    items: groupItems,
                });
            }

            return result;
        }, [] as GroupMap[]);

        return {
            columns: columns,
            groups,
        };
    }, [item]);

    return { gridMap };
}
