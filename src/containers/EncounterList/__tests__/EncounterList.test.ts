import { act, renderHook, waitFor } from '@testing-library/react';
import moment from 'moment';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { getReference } from 'fhir-react/lib/services/fhir';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { createEncounter, createPatient, createPractitionerRole, loginAdminUser } from 'src/setupTests';
import { formatHumanDateTime } from 'src/utils/date';

import { useEncounterList } from '../hooks';
import { EncounterListFilterValues } from '../types';

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

const PRACTITIONER_ADDITION_DATA = [
    { name: [{ family: 'Victorov', given: ['Victor', 'Victorovich'] }] },
    { name: [{ family: 'Petrov', given: ['Petr'] }] },
];

describe('Encounter list filters testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test.skip('String and date filters', async () => {
        const patient1 = await createPatient(PATIENTS_ADDITION_DATA[0]);
        const patient2 = await createPatient(PATIENTS_ADDITION_DATA[1]);

        const { practitionerRole: practitionerRole1 } = await createPractitionerRole(PRACTITIONER_ADDITION_DATA[0]!);
        const { practitionerRole: practitionerRole2 } = await createPractitionerRole(PRACTITIONER_ADDITION_DATA[1]!);

        const encounter1 = await createEncounter(
            getReference(patient1),
            getReference(practitionerRole1),
            moment('2020-01-01'),
        );
        const encounter2 = await createEncounter(
            getReference(patient2),
            getReference(practitionerRole2),
            moment('2020-01-10'),
        );

        const encounterData1 = {
            id: encounter1.id,
            patient: patient1,
            practitioner: practitionerRole1.practitioner,
            status: encounter1.status,
            date: encounter1?.period?.start,
            humanReadableDate: encounter1?.period?.start && formatHumanDateTime(encounter1?.period?.start),
        };
        const encounterData2 = {
            id: encounter2.id,
            patient: patient2,
            practitioner: practitionerRole2.practitioner,
            status: encounter2.status,
            date: encounter2?.period?.start,
            humanReadableDate: encounter2?.period?.start && formatHumanDateTime(encounter2?.period?.start),
        };

        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: [
                    {
                        id: 'patient',
                        type: 'string',
                        placeholder: `Search by patient`,
                    },
                    {
                        id: 'practitioner',
                        type: 'string',
                        placeholder: `Search by practitioner`,
                    },
                    {
                        id: 'date',
                        type: 'date',
                        placeholder: [`Start date`, `End date`],
                    },
                ],
            });

            const { encounterDataListRD } = useEncounterList(columnsFilterValues as EncounterListFilterValues);

            return {
                columnsFilterValues,
                encounterDataListRD,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(
            () => {
                expect(isSuccess(result.current.encounterDataListRD)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(2);
            expect(result.current.encounterDataListRD.data[0]?.id).toEqual(encounterData2.id);
            expect(result.current.encounterDataListRD.data[1]?.id).toEqual(encounterData1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('john', 'patient');
        });
        await waitFor(() => {
            expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.encounterDataListRD);
        });
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(1);
            expect(result.current.encounterDataListRD.data[0]?.id).toEqual(encounterData1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('testtest', 'practitioner');
        });
        await waitFor(() => {
            expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.encounterDataListRD);
        });
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(0);
        }

        act(() => {
            result.current.onChangeColumnFilter('', 'patient');
        });
        act(() => {
            result.current.onChangeColumnFilter('petr', 'practitioner');
        });
        await waitFor(() => {
            expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.encounterDataListRD);
        });
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(1);
            expect(result.current.encounterDataListRD.data[0]?.id).toBe(encounter1.id);
        }

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.encounterDataListRD);
        });
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(2);
        }

        act(() => {
            result.current.onChangeColumnFilter([moment('2019-12-31'), moment('2020-01-02')], 'date');
        });
        await waitFor(() => {
            expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.encounterDataListRD);
        });
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(2);
            expect(result.current.encounterDataListRD.data[0]?.id).toEqual(encounterData1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter([moment('2019-12-01'), moment('2019-12-31')], 'date');
        });
        await waitFor(() => {
            expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.encounterDataListRD);
        });
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(0);
        }

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.encounterDataListRD);
        });
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(2);
        }
    });
});
