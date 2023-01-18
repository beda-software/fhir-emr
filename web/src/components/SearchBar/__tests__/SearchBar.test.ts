import moment from 'moment';
import { act, renderHook, waitFor } from '@testing-library/react';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { EncounterData } from 'src/containers/EncounterList/types';
import { createEncounter, createPatient, createPractitioner } from 'src/setupTests';
import { formatHumanDateTime } from 'src/utils/date';
import { getEncounterStatus } from 'src/utils/format';

import { useSearchBar } from '../hooks';

describe('SearchBar filters testing', () => {
    test('String one filters', async () => {
        const patient1 = await withRootAccess(
            async () =>
                await createPatient({
                    name: [{ family: 'Patient family test1', given: ['Patient name test1'] }],
                }),
        );
        const patient2 = await withRootAccess(
            async () =>
                await createPatient({
                    name: [{ family: 'Patient family test2', given: ['Patient name test2'] }],
                }),
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
            result.current.onChangeColumnFilter('test3', 'patient');
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
            result.current.onChangeColumnFilter('test1', 'patient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('test2', 'patient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('test', 'patient');
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
            async () =>
                await createPatient({
                    name: [{ family: 'Patient family test1', given: ['Patient name test1'] }],
                }),
        );
        const practitioner1 = await withRootAccess(
            async () =>
                await createPractitioner({
                    name: [
                        { family: 'Practitioner family test1', given: ['Practitioner name test1'] },
                    ],
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
            key: encounter1.id,
            patient: renderHumanName(patient1.name?.[0]),
            practitioner: renderHumanName(practitioner1?.name?.[0]),
            status: getEncounterStatus(encounter1.status),
            date: encounter1?.period?.start,
            humanReadableDate:
                encounter1?.period?.start && formatHumanDateTime(encounter1?.period?.start),
        };

        const patient2 = await withRootAccess(
            async () =>
                await createPatient({
                    name: [{ family: 'Patient family test2', given: ['Patient name test2'] }],
                }),
        );
        const practitioner2 = await withRootAccess(
            async () =>
                await createPractitioner({
                    name: [
                        { family: 'Practitioner family test2', given: ['Practitioner name test2'] },
                    ],
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
            key: encounter2.id,
            patient: renderHumanName(patient2.name?.[0]),
            practitioner: renderHumanName(practitioner2?.name?.[0]),
            status: getEncounterStatus(encounter2.status),
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
                        key: 'patient',
                        placeholder: 'Search by patient',
                    },
                    {
                        id: 'encounterPractitioner',
                        type: 'string',
                        key: 'practitioner',
                        placeholder: 'Search by practitioner',
                    },
                ],
                data: [encounterData1, encounterData2],
            }),
        );

        act(() => {
            result.current.onChangeColumnFilter('test3', 'encounterPatient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(0);
        });

        act(() => {
            result.current.onChangeColumnFilter('test2', 'encounterPatient');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('test2', 'encounterPractitioner');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });

        act(() => {
            result.current.onChangeColumnFilter('test3', 'encounterPractitioner');
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
            result.current.onChangeColumnFilter('test1', 'encounterPractitioner');
        });
        await waitFor(() => {
            expect(result.current.filteredData.length).toBe(1);
        });
    });

    test('Date filters', async () => {
        const patient1 = await withRootAccess(
            async () =>
                await createPatient({
                    name: [{ family: 'Patient family test1', given: ['Patient name test1'] }],
                    birthDate: '2000-01-01',
                }),
        );
        const patient2 = await withRootAccess(
            async () =>
                await createPatient({
                    name: [{ family: 'Patient family test2', given: ['Patient name test2'] }],
                    birthDate: '2000-02-01',
                }),
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
