import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

import { useGridGroup } from '../hooks';
import { GridMap } from '../types';

function removeTextFromItems(items: (QuestionnaireItem | undefined)[]) {
    return items.map((item) => {
        if (item) {
            return { ...item, text: undefined };
        }
    });
}

describe('useGridGroup', () => {
    it('should return undefined if input item is not a group or does not have text or items', () => {
        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'choice',
            text: 'Some Question',
        };

        const { result } = renderHook(() => useGridGroup(input));

        expect(result.current.gridMap).toBeUndefined();
    });

    it('should return a correct grid map for a valid input', () => {
        const GROUP_1: QuestionnaireItem = {
            linkId: '1.1',
            text: 'Group1',
            type: 'group',
            item: [
                { linkId: '1.1.1', text: 'Question1', type: 'choice' },
                { linkId: '1.1.2', text: 'Question2', type: 'choice' },
            ],
        };

        const GROUP_2: QuestionnaireItem = {
            linkId: '1.2',
            text: 'Group2',
            type: 'group',
            item: [
                { linkId: '1.2.1', text: 'Question1', type: 'choice' },
                { linkId: '1.2.2', text: 'Question3', type: 'choice' },
            ],
        };

        const GROUP_3: QuestionnaireItem = {
            linkId: '1.3',
            text: 'Group3',
            type: 'group',
            item: [
                { linkId: '1.3.1', text: 'Question1', type: 'choice' },
                { linkId: '1.3.2', text: 'Question4', type: 'choice' },
            ],
        };

        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [GROUP_1, GROUP_2, GROUP_3],
        };

        const expectedOutput: GridMap = {
            columns: ['Question1', 'Question2', 'Question3', 'Question4'],
            groups: [
                {
                    group: GROUP_1,
                    items: removeTextFromItems([GROUP_1.item![0], GROUP_1.item![1], undefined, undefined]),
                },
                {
                    group: GROUP_2,
                    items: removeTextFromItems([GROUP_2.item![0], undefined, GROUP_2.item![1], undefined]),
                },
                {
                    group: GROUP_3,
                    items: removeTextFromItems([GROUP_3.item![0], undefined, undefined, GROUP_3.item![1]]),
                },
            ],
        };

        const { result } = renderHook(() => useGridGroup(input));
        expect(result.current.gridMap).toEqual(expectedOutput);
    });

    it('should handle missing questions in some groups', () => {
        const GROUP_1: QuestionnaireItem = {
            linkId: '1.1',
            text: 'Group1',
            type: 'group',
            item: [{ linkId: '1.1.1', text: 'Question1', type: 'choice' }],
        };

        const GROUP_2: QuestionnaireItem = {
            linkId: '1.2',
            text: 'Group2',
            type: 'group',
            item: [
                { linkId: '1.2.1', text: 'Question2', type: 'choice' },
                { linkId: '1.2.2', text: 'Question3', type: 'choice' },
            ],
        };

        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [GROUP_1, GROUP_2],
        };

        const expectedOutput: GridMap = {
            columns: ['Question1', 'Question2', 'Question3'],
            groups: [
                {
                    group: GROUP_1,
                    items: removeTextFromItems([GROUP_1.item![0], undefined, undefined]),
                },
                {
                    group: GROUP_2,
                    items: removeTextFromItems([undefined, GROUP_2.item![0], GROUP_2.item![1]]),
                },
            ],
        };

        const { result } = renderHook(() => useGridGroup(input));
        expect(result.current.gridMap).toEqual(expectedOutput);
    });

    it('should return empty groups and columns if there are no questions', () => {
        const GROUP_1: QuestionnaireItem = {
            linkId: '1.1',
            text: 'Group1',
            type: 'group',
            item: [],
        };

        const GROUP_2: QuestionnaireItem = {
            linkId: '1.2',
            text: 'Group2',
            type: 'group',
            item: [],
        };

        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [GROUP_1, GROUP_2],
        };

        const expectedOutput: GridMap = {
            columns: [],
            groups: [
                {
                    group: GROUP_1,
                    items: [],
                },
                {
                    group: GROUP_2,
                    items: [],
                },
            ],
        };

        const { result } = renderHook(() => useGridGroup(input));
        expect(result.current.gridMap).toEqual(expectedOutput);
    });

    it('should handle nested groups correctly', () => {
        const NESTED_GROUP: QuestionnaireItem = {
            linkId: '1.1.1',
            text: 'NestedGroup',
            type: 'group',
            item: [{ linkId: '1.1.1.1', text: 'Question1', type: 'choice' }],
        };

        const GROUP_1: QuestionnaireItem = {
            linkId: '1.1',
            text: 'Group1',
            type: 'group',
            item: [NESTED_GROUP],
        };

        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [GROUP_1],
        };

        const expectedOutput: GridMap = {
            columns: ['NestedGroup'],
            groups: [
                {
                    group: GROUP_1,
                    items: [NESTED_GROUP],
                },
            ],
        };

        const { result } = renderHook(() => useGridGroup(input));
        expect(result.current.gridMap).toEqual(expectedOutput);
    });
});
