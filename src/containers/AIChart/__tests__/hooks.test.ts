import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { failure, success } from '@beda.software/remote-data';

vi.mock('src/services/magic-search', () => ({ performMagicSearch: vi.fn() }));
vi.mock('src/services/view-chart', () => ({ selectViewChart: vi.fn() }));

import { performMagicSearch } from 'src/services/magic-search';
import { selectViewChart } from 'src/services/view-chart';

import { useAIChartWidgets } from '../hooks';

const query = { resourceType: 'MedicationStatement' as const, searchParams: { status: 'active' }, tableColumns: [] };

describe('useAIChartWidgets.addWidget', () => {
    beforeEach(() => {
        // localStorage is a vi.fn() stub in setupTests
        vi.mocked(localStorage.getItem).mockReset();
        vi.mocked(localStorage.setItem).mockReset();
        vi.mocked(performMagicSearch).mockReset();
        vi.mocked(selectViewChart).mockReset();
    });

    it('adds a chart widget when a ViewDefinition matches', async () => {
        vi.mocked(selectViewChart).mockResolvedValue(
            success({ viewDefinition: 'obs-body-mass-index', chartKind: 'numeric', title: 'Body mass index' }),
        );

        const { result } = renderHook(() => useAIChartWidgets());
        await act(async () => {
            await result.current.addWidget('BMI dashboard');
        });

        expect(result.current.widgets).toEqual([
            {
                kind: 'chart',
                id: expect.any(String),
                prompt: 'BMI dashboard',
                viewDefinition: 'obs-body-mass-index',
                chartKind: 'numeric',
                title: 'Body mass index',
            },
        ]);
        expect(performMagicSearch).not.toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith('aiChartWidgets', JSON.stringify(result.current.widgets));
    });

    it('falls back to a table when no ViewDefinition matches', async () => {
        vi.mocked(selectViewChart).mockResolvedValue(success({ viewDefinition: null, chartKind: null, title: null }));
        vi.mocked(performMagicSearch).mockResolvedValue(success(query));

        const { result } = renderHook(() => useAIChartWidgets());
        await act(async () => {
            await result.current.addWidget('Current medications');
        });

        expect(result.current.widgets).toEqual([
            { kind: 'table', id: expect.any(String), prompt: 'Current medications', query },
        ]);
        expect(vi.mocked(performMagicSearch).mock.calls[0]![0]).toContain('Request: Current medications');
    });

    it('falls back to a table when the chart selection fails', async () => {
        vi.mocked(selectViewChart).mockResolvedValue(failure({ message: 'Not Found' }));
        vi.mocked(performMagicSearch).mockResolvedValue(success(query));

        const { result } = renderHook(() => useAIChartWidgets());
        await act(async () => {
            await result.current.addWidget('Current medications');
        });

        expect(result.current.widgets.map((widget) => widget.kind)).toEqual(['table']);
    });

    it('returns the magic search failure and adds nothing when both fail', async () => {
        vi.mocked(selectViewChart).mockResolvedValue(success({ viewDefinition: null, chartKind: null, title: null }));
        vi.mocked(performMagicSearch).mockResolvedValue(failure({ message: 'boom' }));

        const { result } = renderHook(() => useAIChartWidgets());
        let response;
        await act(async () => {
            response = await result.current.addWidget('Something');
        });

        expect(response).toEqual(failure({ message: 'boom' }));
        expect(result.current.widgets).toEqual([]);
    });
});
