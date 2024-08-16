import { describe, it, expect } from 'vitest';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

import { createGridMap } from '../utils';

describe('createGridMap', () => {
    it('should return undefined if input item is not a group or does not have text or items', () => {
        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'choice',
            text: 'Some Question',
        };

        const result = createGridMap(input);
        expect(result).toBeUndefined();
    });

    it('should return a correct grid map for a valid input', () => {
        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [
                {
                    linkId: '1.1',
                    text: 'Group1',
                    type: 'group',
                    item: [
                        { linkId: '1.1.1', text: 'Question1', type: 'choice' },
                        { linkId: '1.1.2', text: 'Question2', type: 'choice' },
                    ],
                },
                {
                    linkId: '1.2',
                    text: 'Group2',
                    type: 'group',
                    item: [
                        { linkId: '1.2.1', text: 'Question1', type: 'choice' },
                        { linkId: '1.2.2', text: 'Question3', type: 'choice' },
                    ],
                },
                {
                    linkId: '1.3',
                    text: 'Group3',
                    type: 'group',
                    item: [
                        { linkId: '1.3.1', text: 'Question1', type: 'choice' },
                        { linkId: '1.3.2', text: 'Question4', type: 'choice' },
                    ],
                },
            ],
        };

        const expectedOutput = {
            title: 'Grid',
            columns: ['Question1', 'Question2', 'Question3', 'Question4'],
            groups: [
                {
                    name: 'Group1',
                    items: [
                        { linkId: '1.1.1', text: 'Question1', type: 'choice' },
                        { linkId: '1.1.2', text: 'Question2', type: 'choice' },
                        undefined,
                        undefined,
                    ],
                },
                {
                    name: 'Group2',
                    items: [
                        { linkId: '1.2.1', text: 'Question1', type: 'choice' },
                        undefined,
                        { linkId: '1.2.2', text: 'Question3', type: 'choice' },
                        undefined,
                    ],
                },
                {
                    name: 'Group3',
                    items: [
                        { linkId: '1.3.1', text: 'Question1', type: 'choice' },
                        undefined,
                        undefined,
                        { linkId: '1.3.2', text: 'Question4', type: 'choice' },
                    ],
                },
            ],
        };

        const result = createGridMap(input);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle missing questions in some groups', () => {
        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [
                {
                    linkId: '1.1',
                    text: 'Group1',
                    type: 'group',
                    item: [{ linkId: '1.1.1', text: 'Question1', type: 'choice' }],
                },
                {
                    linkId: '1.2',
                    text: 'Group2',
                    type: 'group',
                    item: [
                        { linkId: '1.2.1', text: 'Question2', type: 'choice' },
                        { linkId: '1.2.2', text: 'Question3', type: 'choice' },
                    ],
                },
            ],
        };

        const expectedOutput = {
            title: 'Grid',
            columns: ['Question1', 'Question2', 'Question3'],
            groups: [
                {
                    name: 'Group1',
                    items: [{ linkId: '1.1.1', text: 'Question1', type: 'choice' }, undefined, undefined],
                },
                {
                    name: 'Group2',
                    items: [
                        undefined,
                        { linkId: '1.2.1', text: 'Question2', type: 'choice' },
                        { linkId: '1.2.2', text: 'Question3', type: 'choice' },
                    ],
                },
            ],
        };

        const result = createGridMap(input);
        expect(result).toEqual(expectedOutput);
    });

    it('should return empty groups and columns if there are no questions', () => {
        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [
                {
                    linkId: '1.1',
                    text: 'Group1',
                    type: 'group',
                    item: [],
                },
                {
                    linkId: '1.2',
                    text: 'Group2',
                    type: 'group',
                    item: [],
                },
            ],
        };

        const expectedOutput = {
            title: 'Grid',
            columns: [],
            groups: [
                {
                    name: 'Group1',
                    items: [],
                },
                {
                    name: 'Group2',
                    items: [],
                },
            ],
        };

        const result = createGridMap(input);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle nested groups correctly', () => {
        const input: QuestionnaireItem = {
            linkId: '1',
            type: 'group',
            text: 'Grid',
            item: [
                {
                    linkId: '1.1',
                    text: 'Group1',
                    type: 'group',
                    item: [
                        {
                            linkId: '1.1.1',
                            text: 'NestedGroup',
                            type: 'group',
                            item: [{ linkId: '1.1.1.1', text: 'Question1', type: 'choice' }],
                        },
                    ],
                },
            ],
        };

        const expectedOutput = {
            title: 'Grid',
            columns: ['NestedGroup'],
            groups: [
                {
                    name: 'Group1',
                    items: [
                        {
                            linkId: '1.1.1',
                            text: 'NestedGroup',
                            type: 'group',
                            item: [{ linkId: '1.1.1.1', text: 'Question1', type: 'choice' }],
                        },
                    ],
                },
            ],
        };

        const result = createGridMap(input);
        expect(result).toEqual(expectedOutput);
    });
});
