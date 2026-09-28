import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { success } from '@beda.software/remote-data';

vi.mock('src/services/fhir', () => ({
    service: vi.fn(),
    aidboxService: vi.fn(),
}));

import { aidboxService, service } from 'src/services/fhir';

import { useViewChartRows } from '../hooks';

describe('useViewChartRows', () => {
    beforeEach(() => {
        vi.mocked(service).mockReset();
        vi.mocked(aidboxService).mockReset();
    });

    it('ViewDefinition source posts to $run with a Parameters body and returns rows', async () => {
        vi.mocked(service).mockResolvedValue(success([{ id: 'a' }, { id: 'b' }]));

        const { result } = renderHook(() =>
            useViewChartRows<{ id: string }>(
                { type: 'ViewDefinition', reference: 'ViewDefinition/test-view' },
                { parameters: [{ name: 'patient', valueReference: { reference: 'Patient/p-1' } }] },
            ),
        );

        await waitFor(() => expect(result.current[0].status).toBe('Success'));

        expect(service).toHaveBeenCalledWith({
            method: 'POST',
            url: '/ViewDefinition/test-view/$run',
            data: {
                resourceType: 'Parameters',
                parameter: [
                    { name: 'patient', valueReference: { reference: 'Patient/p-1' } },
                    { name: '_format', valueCode: 'json' },
                ],
            },
        });
        expect(aidboxService).not.toHaveBeenCalled();
        expect(result.current[0]).toEqual(success([{ id: 'a' }, { id: 'b' }]));
    });

    it('AidboxQuery source gets /$query with flattened params and unwraps the data envelope', async () => {
        vi.mocked(aidboxService).mockResolvedValue(success({ data: [{ id: 'a' }] }));

        const { result } = renderHook(() =>
            useViewChartRows<{ id: string }>(
                { type: 'AidboxQuery', reference: 'AidboxQuery/test-query' },
                {
                    parameters: [
                        { name: 'patient', valueString: 'p-1' },
                        { name: 'code', valueCode: 'sCPS' },
                        { name: 'limit', valueInteger: 100 },
                    ],
                },
            ),
        );

        await waitFor(() => expect(result.current[0].status).toBe('Success'));

        expect(aidboxService).toHaveBeenCalledWith({
            method: 'GET',
            url: '/$query/test-query',
            params: { patient: 'p-1', code: 'sCPS', limit: 100 },
        });
        expect(service).not.toHaveBeenCalled();
        expect(result.current[0]).toEqual(success([{ id: 'a' }]));
    });

    it('Library source posts to $sqlquery-run with nested Parameters and returns rows', async () => {
        vi.mocked(service).mockResolvedValue(success([{ id: 'a' }, { id: 'b' }]));

        const { result } = renderHook(() =>
            useViewChartRows<{ id: string }>(
                { type: 'Library', reference: 'Library/test-sql-query' },
                { parameters: [{ name: 'patient', valueReference: { reference: 'Patient/p-1' } }] },
            ),
        );

        await waitFor(() => expect(result.current[0].status).toBe('Success'));

        expect(service).toHaveBeenCalledWith({
            method: 'POST',
            url: '/Library/test-sql-query/$sqlquery-run',
            data: {
                resourceType: 'Parameters',
                parameter: [
                    { name: '_format', valueCode: 'json' },
                    {
                        name: 'parameters',
                        resource: {
                            resourceType: 'Parameters',
                            parameter: [{ name: 'patient', valueReference: { reference: 'Patient/p-1' } }],
                        },
                    },
                ],
            },
        });
        expect(aidboxService).not.toHaveBeenCalled();
        expect(result.current[0]).toEqual(success([{ id: 'a' }, { id: 'b' }]));
    });

    it('applies the sort comparator to returned rows', async () => {
        vi.mocked(service).mockResolvedValue(success([{ n: 3 }, { n: 1 }, { n: 2 }]));

        const { result } = renderHook(() =>
            useViewChartRows<{ n: number }>(
                { type: 'ViewDefinition', reference: 'ViewDefinition/test-view' },
                { sort: (a, b) => a.n - b.n },
            ),
        );

        await waitFor(() => expect(result.current[0].status).toBe('Success'));

        const remoteData = result.current[0];
        if (remoteData.status !== 'Success') {
            throw new Error('Expected success state');
        }
        expect(remoteData.data.map((row) => row.n)).toEqual([1, 2, 3]);
    });
});
