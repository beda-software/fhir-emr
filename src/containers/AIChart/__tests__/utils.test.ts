import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loadAIChartWidgets, parseAIChartWidgetConfig } from '../utils';

const query = { resourceType: 'Observation', searchParams: { code: '39156-5' }, tableColumns: [] };

describe('parseAIChartWidgetConfig', () => {
    it('reads entries saved before charts were supported as tables', () => {
        expect(parseAIChartWidgetConfig({ id: 'w1', prompt: 'BMI', query })).toEqual({
            kind: 'table',
            id: 'w1',
            prompt: 'BMI',
            query,
        });
    });

    it('reads table widgets', () => {
        expect(parseAIChartWidgetConfig({ kind: 'table', id: 'w1', prompt: 'BMI', query })?.kind).toBe('table');
    });

    it('reads chart widgets', () => {
        const widget = {
            kind: 'chart',
            id: 'w2',
            prompt: 'BMI dashboard',
            viewDefinition: 'obs-body-mass-index',
            chartKind: 'numeric',
            title: 'Body mass index',
        };

        expect(parseAIChartWidgetConfig(widget)).toEqual(widget);
    });

    it.each([
        ['without id', { prompt: 'BMI', query }],
        ['table without query', { kind: 'table', id: 'w1', prompt: 'BMI' }],
        [
            'chart with unknown chart kind',
            { kind: 'chart', id: 'w2', prompt: 'BMI', viewDefinition: 'obs-x', chartKind: 'pie', title: 'X' },
        ],
        ['chart without view definition', { kind: 'chart', id: 'w2', prompt: 'BMI', chartKind: 'numeric', title: 'X' }],
        ['unknown kind', { kind: 'map', id: 'w3', prompt: 'BMI', query }],
    ])('skips malformed entry: %s', (_, value) => {
        expect(parseAIChartWidgetConfig(value)).toBeUndefined();
    });
});

describe('loadAIChartWidgets', () => {
    // localStorage is a vi.fn() stub in setupTests
    beforeEach(() => {
        vi.mocked(localStorage.getItem).mockReset();
    });

    it('keeps valid entries and drops malformed ones', () => {
        vi.mocked(localStorage.getItem).mockReturnValue(
            JSON.stringify([
                { id: 'w1', prompt: 'BMI', query },
                { id: 'broken' },
                {
                    kind: 'chart',
                    id: 'w2',
                    prompt: 'BP',
                    viewDefinition: 'obs-blood-pressure-panel',
                    chartKind: 'blood-pressure',
                    title: 'Blood pressure panel',
                },
            ]),
        );

        expect(loadAIChartWidgets().map((widget) => [widget.id, widget.kind])).toEqual([
            ['w1', 'table'],
            ['w2', 'chart'],
        ]);
        expect(localStorage.getItem).toHaveBeenCalledWith('aiChartWidgets');
    });
});
