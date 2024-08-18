import { QuestionnaireItem } from '@beda.software/aidbox-types';

export interface GridMap {
    columns: QuestionnaireItem['text'][];
    groups: GroupMap[];
}

interface GroupMap {
    group: QuestionnaireItem;
    items: (QuestionnaireItem | undefined)[];
}

export function createGridMap(item: QuestionnaireItem): GridMap | undefined {
    if (!item || item.type !== 'group' || !item.text || !item.item) {
        return undefined;
    }

    const columns = extractColumns(item);
    const groups = mapGroups(item, columns);

    return {
        columns: columns,
        groups,
    };
}

function extractColumns(item: QuestionnaireItem): string[] {
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

    return Array.from(columnsSet);
}

function mapGroups(item: QuestionnaireItem, columns: string[]): GroupMap[] {
    return item.item!.reduce((acc, group) => {
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

                return item;
            });

            result.push({
                group,
                items: groupItems,
            });
        }

        return result;
    }, [] as GroupMap[]);
}
