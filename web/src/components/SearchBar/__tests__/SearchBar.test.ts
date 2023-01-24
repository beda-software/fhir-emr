import { act, renderHook, waitFor } from '@testing-library/react';
import moment from 'moment';

import { withRootAccess } from 'aidbox-react/lib/utils/tests';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { EncounterData } from 'src/components/EncountersTable/types';
import { createEncounter, createPatient, createPractitioner } from 'src/setupTests';
import { formatHumanDateTime } from 'src/utils/date';

import { useSearchBar } from '../hooks';

const PATIENTS_ADDITION_DATA = [
    {
        name: [
            {
                given: ['Doe'],
                family: 'John',
            },
        ],
        birthDate: '2000-01-01',
    },
    {
        name: [
            {
                given: ['Ivan', 'Ivanovich'],
                family: 'Ivanov',
            },
        ],
        birthDate: '2000-02-01',
    },
];

describe('SearchBar filters testing', () => {
    test('String one filters', async () => {
        const patient1 = await withRootAccess(
            async () => await createPatient(PATIENTS_ADDITION_DATA[0]),
        );
        const patient2 = await withRootAccess(
            async () => await createPatient(PATIENTS_ADDITION_DATA[1]),
        );

        const { result } = renderHook(() =>
            useSearchBar<Patient>({
                columns: [
                    {
                        id: 'patient',
                        type: 'string',
                        key: (patientSearchItem) => renderHumanName(patientSearchItem.name?.[0]),
                        placeholder: 'Find patient',
                    },
                ],
                data: [patient1, patient2],
            }),
        );

        act(() => {
            result.current.onChangeColumnFilter('test', 'patient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(0);
        });

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(2);
        });

        act(() => {
            result.current.onChangeColumnFilter('doe', 'patient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('iva', 'patient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('o', 'patient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(2);
        });

        act(() => {
            result.current.onChangeColumnFilter('', 'patient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(2);
        });
    });

    test('String multiple filters', async () => {
        const patient1 = await withRootAccess(
            async () => await createPatient(PATIENTS_ADDITION_DATA[0]),
        );
        const practitioner1 = await withRootAccess(
            async () =>
                await createPractitioner({
                    name: [{ family: 'Victorov', given: ['Victor', 'Victorovich'] }],
                }),
        );
        const encounter1 = await withRootAccess(
            async () =>
                await createEncounter(
                    { id: patient1.id, resourceType: 'Patient' },
                    { id: practitioner1.id, resourceType: 'Practitioner' },
                ),
        );
        const encounterData1 = {
            id: encounter1.id,
            patient: patient1,
            practitioner: practitioner1,
            status: encounter1.status,
            date: encounter1?.period?.start,
            humanReadableDate:
                encounter1?.period?.start && formatHumanDateTime(encounter1?.period?.start),
        };

        const patient2 = await withRootAccess(
            async () => await createPatient(PATIENTS_ADDITION_DATA[1]),
        );
        const practitioner2 = await withRootAccess(
            async () =>
                await createPractitioner({
                    name: [{ family: 'Jackson', given: ['Mickle'] }],
                }),
        );
        const encounter2 = await withRootAccess(
            async () =>
                await createEncounter(
                    { id: patient2.id, resourceType: 'Patient' },
                    { id: practitioner2.id, resourceType: 'Practitioner' },
                ),
        );
        const encounterData2 = {
            id: encounter2.id,
            patient: patient2,
            practitioner: practitioner2,
            status: encounter2.status,
            date: encounter2?.period?.start,
            humanReadableDate:
                encounter2?.period?.start && formatHumanDateTime(encounter2?.period?.start),
        };

        const { result } = renderHook(() =>
            useSearchBar<EncounterData>({
                columns: [
                    {
                        id: 'encounterPatient',
                        type: 'string',
                        key: (resource) => renderHumanName(resource.patient?.name?.[0]),
                        placeholder: 'Search by patient',
                    },
                    {
                        id: 'encounterPractitioner',
                        type: 'string',
                        key: (resource) => renderHumanName(resource.practitioner?.name?.[0]),
                        placeholder: 'Search by practitioner',
                    },
                ],
                data: [encounterData1, encounterData2],
            }),
        );

        act(() => {
            result.current.onChangeColumnFilter('test', 'encounterPatient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(0);
        });

        act(() => {
            result.current.onChangeColumnFilter('doe', 'encounterPatient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('vict', 'encounterPractitioner');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('test', 'encounterPractitioner');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(0);
        });

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(2);
        });

        act(() => {
            result.current.onChangeColumnFilter('jackson', 'encounterPractitioner');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });
    });

    test('Date filters', async () => {
        const patient1 = await withRootAccess(
            async () => await createPatient(PATIENTS_ADDITION_DATA[0]),
        );
        const patient2 = await withRootAccess(
            async () => await createPatient(PATIENTS_ADDITION_DATA[1]),
        );

        const { result } = renderHook(() =>
            useSearchBar<Patient>({
                columns: [
                    {
                        id: 'patient',
                        type: 'date',
                        key: 'birthDate',
                        placeholder: ['From', 'To'],
                    },
                ],
                data: [patient1, patient2],
            }),
        );

        act(() => {
            result.current.onChangeColumnFilter(
                [moment('2000-03-01'), moment('2000-03-02')],
                'patient',
            );
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(0);
        });

        act(() => {
            result.current.onChangeColumnFilter(
                [moment('1999-12-31'), moment('2000-01-02')],
                'patient',
            );
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(2);
        });

        act(() => {
            result.current.onChangeColumnFilter(
                [moment('2000-01-20'), moment('2000-02-02')],
                'patient',
            );
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });
    });
});
