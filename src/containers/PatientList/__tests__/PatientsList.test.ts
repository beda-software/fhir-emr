import { act, renderHook, waitFor } from '@testing-library/react';

import { isLoading, isSuccess } from '@beda.software/remote-data';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { createPatient, loginAdminUser } from 'src/setupTests';

import { usePatientList } from '../hooks';
import { getPatientListSearchBarColumns } from '../searchBarUtils';

const PATIENTS_ADDITION_DATA = [
    {
        name: [
            {
                given: ['Doe'],
                family: 'John',
            },
        ],
    },
    {
        name: [
            {
                given: ['Ivan', 'Ivanovich'],
                family: 'Ivanov',
            },
        ],
    },
];

describe('Patient list filters testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    // TODO: Turn off parallel test running
    // vitest --no-threads added, but still there is an error
    // https://vitest.dev/guide/features.html#threads
    test.skip('String filters', async () => {
        const patient1 = await createPatient(PATIENTS_ADDITION_DATA[0]);
        const patient2 = await createPatient(PATIENTS_ADDITION_DATA[1]);

        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: getPatientListSearchBarColumns(),
            });

            const { patientsResponse } = usePatientList(columnsFilterValues as StringTypeColumnFilterValue[], {});

            return {
                columnsFilterValues,
                patientsResponse,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(
            () => {
                expect(isSuccess(result.current.patientsResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(2);
            expect(result.current.patientsResponse.data[0]?.id).toEqual(patient2.id);
            expect(result.current.patientsResponse.data[1]?.id).toEqual(patient1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('john', 'patient');
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(1);
            expect(result.current.patientsResponse.data[0]?.id).toEqual(patient1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('testtest', 'patient');
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(0);
        }

        act(() => {
            result.current.onChangeColumnFilter('ivan', 'patient');
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(1);
            expect(result.current.patientsResponse.data[0]?.id).toEqual(patient2.id);
        }

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(2);
        }
    });
});
