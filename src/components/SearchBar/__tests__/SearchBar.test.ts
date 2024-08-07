import { act, renderHook } from '@testing-library/react';
import moment from 'moment';

import { createPatient, loginAdminUser } from 'src/setupTests';

import { useSearchBar } from '../hooks';
import { SearchBarColumnType } from '../types';

const PATIENTS_ADDITION_DATA = [
    {
        name: [
            {
                given: ['Search'],
                family: 'Bar',
            },
        ],
        birthDate: '2000-01-01',
    },
    {
        name: [
            {
                given: ['Alec'],
                family: 'Baldwin',
            },
        ],
        birthDate: '1958-03-04',
    },
];

describe('SearchBar filters testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test('String one filters', async () => {
        const [patient1, patient2] = await Promise.all([
            createPatient(PATIENTS_ADDITION_DATA[0]),
            createPatient(PATIENTS_ADDITION_DATA[1]),
        ]);

        const patientReference1 = {
            value: {
                Reference: {
                    resourceType: 'Patient',
                    id: patient1.id,
                },
            },
        };
        const patientReference2 = {
            value: {
                Reference: {
                    resourceType: 'Patient',
                    id: patient2.id,
                },
            },
        };

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
            result.current.onChangeColumnFilter(patientReference1, 'patient');
        });
        act(() => {
            result.current.onChangeColumnFilter([moment('2023-01-01'), moment('2023-01-20')], 'date');
        });

        expect(result.current.columnsFilterValues.length).toEqual(3);
        expect(result.current.columnsFilterValues[0]!.value).toEqual(patientReference1);
        expect(result.current.columnsFilterValues[1]!.value).toBeUndefined();
        expect(result.current.columnsFilterValues[2]!.value).toEqual([moment('2023-01-01'), moment('2023-01-20')]);

        act(() => {
            result.current.onChangeColumnFilter('Alec', 'practitioner');
        });

        expect(result.current.columnsFilterValues.length).toEqual(3);
        expect(result.current.columnsFilterValues[0]!.value).toEqual(patientReference1);
        expect(result.current.columnsFilterValues[1]!.value).toEqual('Alec');
        expect(result.current.columnsFilterValues[2]!.value).toEqual([moment('2023-01-01'), moment('2023-01-20')]);

        act(() => {
            result.current.onChangeColumnFilter(patientReference2, 'patient');
        });

        expect(result.current.columnsFilterValues.length).toEqual(3);
        expect(result.current.columnsFilterValues[0]!.value).toEqual(patientReference2);
        expect(result.current.columnsFilterValues[1]!.value).toEqual('Alec');
        expect(result.current.columnsFilterValues[2]!.value).toEqual([moment('2023-01-01'), moment('2023-01-20')]);

        act(() => {
            result.current.onResetFilters();
        });

        expect(result.current.columnsFilterValues.length).toEqual(3);
        expect(result.current.columnsFilterValues[0]!.value).toEqual(null);
        expect(result.current.columnsFilterValues[1]!.value).toBeUndefined();
        expect(result.current.columnsFilterValues[2]!.value).toBeUndefined();
    });
});
