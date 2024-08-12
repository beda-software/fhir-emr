import { act, renderHook, waitFor } from '@testing-library/react';

import { isLoading, isSuccess } from '@beda.software/remote-data';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { createPractitionerRole, loginAdminUser } from 'src/setupTests';

import { usePractitionersList } from '../hooks';
import { getPractitionerListSearchBarColumns } from '../searchBarUtils';

const PRACTITIONER_ADDITION_DATA = [
    { name: [{ family: 'Victorov', given: ['Victor', 'Victorovich'] }] },
    { name: [{ family: 'Petrov', given: ['Petr'] }] },
];

describe('Practitioner list filters testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test.skip('String filters', async () => {
        const { practitionerRole: _practitionerRole1, practitioner: practitioner1 } = await createPractitionerRole(
            PRACTITIONER_ADDITION_DATA[0]!,
        );
        const { practitionerRole: _practitionerRole2, practitioner: practitioner2 } = await createPractitionerRole(
            PRACTITIONER_ADDITION_DATA[1]!,
        );

        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: getPractitionerListSearchBarColumns(),
            });

            const { practitionerDataListRD } = usePractitionersList(
                columnsFilterValues as StringTypeColumnFilterValue[],
            );

            return {
                columnsFilterValues,
                practitionerDataListRD,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(
            () => {
                if (!isSuccess(result.current.practitionerDataListRD)) return false;
                expect(result.current.practitionerDataListRD.data.length).toEqual(2);
                expect(result.current.practitionerDataListRD.data[0]?.id).toEqual(practitioner1.id);
                expect(result.current.practitionerDataListRD.data[1]?.id).toEqual(practitioner2.id);
                return true;
            },
            { timeout: 30000 },
        );

        act(() => {
            result.current.onChangeColumnFilter('victor', 'practitioner');
        });

        await waitFor(
            () => {
                expect(isLoading(result.current.practitionerDataListRD)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        await waitFor(() => {
            isSuccess(result.current.practitionerDataListRD);
        });
        if (isSuccess(result.current.practitionerDataListRD)) {
            expect(result.current.practitionerDataListRD.data.length).toEqual(1);
            expect(result.current.practitionerDataListRD.data[0]?.id).toEqual(practitioner1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('testtest', 'practitioner');
        });
        await waitFor(
            () => {
                expect(isLoading(result.current.practitionerDataListRD)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        await waitFor(() => {
            isSuccess(result.current.practitionerDataListRD);
        });
        if (isSuccess(result.current.practitionerDataListRD)) {
            expect(result.current.practitionerDataListRD.data.length).toEqual(0);
        }

        act(() => {
            result.current.onChangeColumnFilter('pet', 'practitioner');
        });

        await waitFor(
            () => {
                expect(isLoading(result.current.practitionerDataListRD)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        await waitFor(() => {
            isSuccess(result.current.practitionerDataListRD);
        });
        if (isSuccess(result.current.practitionerDataListRD)) {
            expect(result.current.practitionerDataListRD.data.length).toEqual(1);
            expect(result.current.practitionerDataListRD.data[0]?.id).toBe(practitioner2.id);
        }

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(isLoading(result.current.practitionerDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.practitionerDataListRD);
        });
        if (isSuccess(result.current.practitionerDataListRD)) {
            expect(result.current.practitionerDataListRD.data.length).toEqual(2);
        }
    });
});
