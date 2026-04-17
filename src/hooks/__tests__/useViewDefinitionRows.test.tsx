import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { success } from '@beda.software/remote-data';

vi.mock('src/services/fhir', () => ({
    service: vi.fn(),
}));

import { service } from 'src/services/fhir';

import { useViewDefinitionRows } from '../useViewDefinitionRows';

describe('useViewDefinitionRows', () => {
    beforeEach(() => {
        vi.mocked(service).mockReset();
    });

    it('posts to $run with Parameters body and returns rows', async () => {
        vi.mocked(service).mockResolvedValue(success([{ id: 'a' }, { id: 'b' }]));

        const { result } = renderHook(() => useViewDefinitionRows<{ id: string }>('test-view'));

        await waitFor(() => expect(result.current[0].status).toBe('Success'));

        expect(service).toHaveBeenCalledWith({
            method: 'POST',
            url: '/ViewDefinition/test-view/$run',
            data: {
                resourceType: 'Parameters',
                parameter: [{ name: '_format', valueCode: 'json' }],
            },
        });

        expect(result.current[0]).toEqual(success([{ id: 'a' }, { id: 'b' }]));
    });

    it('includes caller parameters and applies sort when provided', async () => {
        vi.mocked(service).mockResolvedValue(success([{ n: 3 }, { n: 1 }, { n: 2 }]));

        const { result } = renderHook(() =>
            useViewDefinitionRows<{ n: number }>('test-view', {
                parameters: [{ name: 'patient', valueReference: { reference: 'Patient/p-1' } }],
                sort: (a, b) => a.n - b.n,
            }),
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

        const remoteData = result.current[0];
        expect(remoteData.status).toBe('Success');
        if (remoteData.status !== 'Success') {
            throw new Error('Expected success state');
        }

        expect(remoteData.data.map((row) => row.n)).toEqual([1, 2, 3]);
    });

    it('short-circuits when disabled', async () => {
        const { result } = renderHook(() => useViewDefinitionRows('test-view', { enabled: false }));

        await waitFor(() => expect(result.current[0].status).toBe('Success'));

        expect(service).not.toHaveBeenCalled();
        expect(result.current[0]).toEqual(success([]));
    });

    it('does not refetch when caller passes fresh parameters with equal content', async () => {
        vi.mocked(service).mockResolvedValue(success([{ id: 'a' }]));

        const { result, rerender } = renderHook(
            ({ patientId }: { patientId: string }) =>
                useViewDefinitionRows<{ id: string }>('test-view', {
                    parameters: [{ name: 'patient', valueReference: { reference: `Patient/${patientId}` } }],
                }),
            { initialProps: { patientId: 'p-1' } },
        );

        await waitFor(() => expect(result.current[0].status).toBe('Success'));
        expect(service).toHaveBeenCalledTimes(1);

        rerender({ patientId: 'p-1' });
        rerender({ patientId: 'p-1' });

        expect(service).toHaveBeenCalledTimes(1);

        rerender({ patientId: 'p-2' });
        await waitFor(() => expect(service).toHaveBeenCalledTimes(2));
    });

    it('re-sorts without refetching when sort comparator changes', async () => {
        vi.mocked(service).mockResolvedValue(success([{ n: 3 }, { n: 1 }, { n: 2 }]));

        const { result, rerender } = renderHook(
            ({ sort }: { sort: (a: { n: number }, b: { n: number }) => number }) =>
                useViewDefinitionRows<{ n: number }>('test-view', { sort }),
            { initialProps: { sort: (a, b) => a.n - b.n } },
        );

        await waitFor(() => expect(result.current[0].status).toBe('Success'));
        expect(service).toHaveBeenCalledTimes(1);

        const ascending = result.current[0];
        if (ascending.status !== 'Success') {
            throw new Error('Expected success state');
        }
        expect(ascending.data.map((row) => row.n)).toEqual([1, 2, 3]);

        rerender({ sort: (a, b) => b.n - a.n });

        expect(service).toHaveBeenCalledTimes(1);
        const descending = result.current[0];
        if (descending.status !== 'Success') {
            throw new Error('Expected success state');
        }
        expect(descending.data.map((row) => row.n)).toEqual([3, 2, 1]);
    });
});
