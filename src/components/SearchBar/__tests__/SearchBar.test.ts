import moment from 'moment';
import { act, renderHook } from '@testing-library/react';

import { useSearchBar } from '../hooks';

describe('SearchBar filters testing', () => {
    test('String one filters', async () => {
        const { result } = renderHook(() =>
            useSearchBar({
                columns: [
                    {
                        id: 'patient',
                        type: 'string',
                        placeholder: 'Find patient',
                    },
                    {
                        id: 'date',
                        type: 'date',
                        placeholder: ['Start date', 'End date'],
                    },
                ],
            }),
        );

        act(() => {
            result.current.onChangeColumnFilter('test', 'patient');
        });
        act(() => {
            result.current.onChangeColumnFilter(
                [moment('2023-01-01'), moment('2023-01-20')],
                'date',
            );
        });

        expect(result.current.columnsFilterValues.length).toEqual(2);
        expect(result.current.columnsFilterValues[0]!.value).toEqual('test');
        expect(result.current.columnsFilterValues[1]!.value).toEqual([
            moment('2023-01-01'),
            moment('2023-01-20'),
        ]);
    });
});
