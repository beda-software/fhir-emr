import { act, renderHook } from '@testing-library/react';
import moment from 'moment';

import { useSearchBar } from '../hooks';
import { SearchBarColumnType } from '../types';

describe('SearchBar filters testing', () => {
    test('String one filters', async () => {
        const { result } = renderHook(() =>
            useSearchBar({
                columns: [
                    {
                        id: 'patient',
                        type: SearchBarColumnType.REFERENCE,
                        placeholder: 'Search by patient',
                        expression: 'Patient',
                        path: "name.given.first() + ' ' + name.family",
                    },
                    {
                        id: 'practitioner',
                        type: SearchBarColumnType.STRING,
                        placeholder: 'Find patient',
                    },
                    {
                        id: 'date',
                        type: SearchBarColumnType.DATE,
                        placeholder: ['Start date', 'End date'],
                    },
                ],
            }),
        );

        act(() => {
            result.current.onChangeColumnFilter('test', 'patient');
        });
        act(() => {
            result.current.onChangeColumnFilter([moment('2023-01-01'), moment('2023-01-20')], 'date');
        });

        expect(result.current.columnsFilterValues.length).toEqual(3);
        expect(result.current.columnsFilterValues[0]!.value).toEqual('test');
        expect(result.current.columnsFilterValues[1]!.value).toEqual([moment('2023-01-01'), moment('2023-01-20')]);
    });
});
