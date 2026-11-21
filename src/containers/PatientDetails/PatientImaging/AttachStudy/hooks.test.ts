import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { failure, success } from '@beda.software/remote-data';

import { useRemoteStudySearch } from './hooks';
import { searchImagingStudies } from '../service';

vi.mock('../service', () => ({ searchImagingStudies: vi.fn(), attachImagingStudy: vi.fn() }));

const patient = { resourceType: 'Patient', id: 'p1' } as const;
const options = { fields: [], fixedQueryParams: {} };
const marker = { system: 'urn:fhir-imaging/managed-by', code: 'measure' };
const found = (total: number) => success({ studies: [], total, owners: new Map() });

afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});

describe('remote search lifecycle', () => {
    it('refreshes unchanged criteria, including retry after a failure', async () => {
        vi.mocked(searchImagingStudies).mockResolvedValueOnce(failure('Unavailable')).mockResolvedValue(found(1));
        const { result } = renderHook(() => useRemoteStudySearch(patient, options, marker));
        await waitFor(() => expect(result.current.searchResponse.status).toBe('Failure'));
        act(() => result.current.search());
        await waitFor(() => expect(result.current.searchResponse).toEqual(found(1)));
        act(() => result.current.search());
        await waitFor(() => expect(searchImagingStudies).toHaveBeenCalledTimes(3));
    });

    it('ignores an older response after moving to another page', async () => {
        let finishFirst!: (value: ReturnType<typeof found>) => void;
        vi.mocked(searchImagingStudies)
            .mockImplementationOnce(
                () =>
                    new Promise<ReturnType<typeof found>>((resolve) => {
                        finishFirst = resolve;
                    }),
            )
            .mockResolvedValueOnce(found(2));
        const { result } = renderHook(() => useRemoteStudySearch(patient, options, marker));
        await waitFor(() => expect(searchImagingStudies).toHaveBeenCalledTimes(1));
        act(() => result.current.changePage(2));
        await waitFor(() => expect(result.current.searchResponse).toEqual(found(2)));
        await act(async () => finishFirst(found(1)));
        expect(result.current.page).toBe(2);
        expect(result.current.searchResponse).toEqual(found(2));
    });

    it('refetches ownership when the target Patient changes', async () => {
        vi.mocked(searchImagingStudies).mockResolvedValue(found(1));
        const { result, rerender } = renderHook(({ id }) => useRemoteStudySearch({ ...patient, id }, options, marker), {
            initialProps: { id: 'p1' },
        });
        await waitFor(() => expect(result.current.searchResponse.status).toBe('Success'));
        rerender({ id: 'p2' });
        await waitFor(() => expect(searchImagingStudies).toHaveBeenCalledTimes(2));
        expect(vi.mocked(searchImagingStudies).mock.calls[1]?.[2].id).toBe('p2');
    });
});
