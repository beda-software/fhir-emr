import { renderHook, waitFor } from '@testing-library/react';

import { SearchParams } from '@beda.software/fhir-react';
import { isFailure, isSuccess } from '@beda.software/remote-data';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';

import { initialSetup } from './utils';
import { usePatientList } from '../hooks';
import { getPatientListSearchBarColumns } from '../searchBarUtils';
import { getPatientSearchParamsForPractitioner } from '../utils';

async function renderPatientsHooks(searchParams: SearchParams) {
    const { result } = renderHook(() => {
        const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
            columns: getPatientListSearchBarColumns(),
        });

        const { patientsResponse } = usePatientList(columnsFilterValues as StringTypeColumnFilterValue[], searchParams);

        return {
            columnsFilterValues,
            patientsResponse,
            onChangeColumnFilter,
            onResetFilters,
        };
    });

    return result;
}

describe('Patient list get by consent', () => {
    test('Get patients with signed consent', async () => {
        const data = await initialSetup();
        const searchParams = getPatientSearchParamsForPractitioner(data.practitioner.id);
        const result = await renderPatientsHooks(searchParams);

        await waitFor(
            () => {
                expect(isSuccess(result.current.patientsResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(1);
            expect(result.current.patientsResponse.data?.[0]?.id).toEqual(data.patients[2]?.id);
        }
    });
    test.skip('Get patients with incorrect search param status', async () => {
        const data = await initialSetup();
        const result = await renderPatientsHooks({ ...data.correctSearchParams, ...{ status: 'draft' } });

        await waitFor(
            () => {
                expect(isFailure(result.current.patientsResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
    });
    test.skip('Get patients with incorrect search param category', async () => {
        const data = await initialSetup();
        const result = await renderPatientsHooks({ ...data.correctSearchParams, ...{ category: 'not-data-sharing' } });

        await waitFor(
            () => {
                expect(isFailure(result.current.patientsResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
    });
    test.skip('Get patients with incorrect search param category', async () => {
        const data = await initialSetup();
        const result = await renderPatientsHooks({ ...data.correctSearchParams, ...{ actor: 'some-actor-id' } });

        await waitFor(
            () => {
                expect(isFailure(result.current.patientsResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
    });
});
