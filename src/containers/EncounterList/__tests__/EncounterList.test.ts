import { act, renderHook, waitFor } from '@testing-library/react';
import { HumanName } from 'fhir/r4b';
import moment from 'moment';

import { getReference } from '@beda.software/fhir-react';
import { isLoading, isSuccess, RemoteData } from '@beda.software/remote-data';

import { EncounterData } from 'src/components/EncountersTable/types';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { useEncounterList } from 'src/containers/EncounterList/hooks';
import { createEncounter, createPatient, createPractitionerRole, loginAdminUser } from 'src/setupTests';
import { renderHumanName } from 'src/utils';
import { formatHumanDateTime } from 'src/utils/date';

import { getEncounterListSearchBarColumns } from '../searchBarUtils';

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

const PRACTITIONER_ADDITION_DATA: { name: HumanName[] }[] = [
    { name: [{ given: ['Victor'], family: 'Petrov' }] },
    { name: [{ given: ['Petr'], family: 'Ivanov' }] },
];

type RenderHookDataResult = {
    current: {
        encounterDataListRD: RemoteData<EncounterData[]>;
    };
};
async function expectIsLoadingAndIsSuccess(result: RenderHookDataResult) {
    await waitFor(() => {
        expect(isLoading(result.current.encounterDataListRD)).toBeTruthy();
    });
    await waitFor(() => {
        expect(isSuccess(result.current.encounterDataListRD)).toBeTruthy();
    });
}

describe('Encounter list filters testing', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('All filter types', async () => {
        const [patient1, patient2] = await Promise.all([
            createPatient(PATIENTS_ADDITION_DATA[0]),
            createPatient(PATIENTS_ADDITION_DATA[1]),
        ]);

        const [{ practitionerRole: practitionerRole1 }, { practitionerRole: practitionerRole2 }] = await Promise.all([
            createPractitionerRole(PRACTITIONER_ADDITION_DATA[0]!),
            createPractitionerRole(PRACTITIONER_ADDITION_DATA[1]!),
        ]);

        const [encounter1, encounter2] = await Promise.all([
            createEncounter(
                getReference(patient1),
                {
                    ...getReference(practitionerRole1),
                    display: renderHumanName(PRACTITIONER_ADDITION_DATA[0]!.name[0]),
                },
                moment('2020-01-01'),
            ),
            createEncounter(
                getReference(patient2),
                {
                    ...getReference(practitionerRole2),
                    display: renderHumanName(PRACTITIONER_ADDITION_DATA[1]!.name[0]),
                },
                moment('2020-01-10'),
            ),
        ]);

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
                columns: getEncounterListSearchBarColumns(),
            });

            const { encounterDataListRD } = useEncounterList(columnsFilterValues);

            return {
                columnsFilterValues,
                encounterDataListRD,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter1.id)).toBeDefined();
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter2.id)).toBeDefined();
        }

        act(() => {
            result.current.onChangeColumnFilter(
                {
                    value: {
                        Reference: {
                            resourceType: 'Patient',
                            id: patient1.id,
                        },
                    },
                },
                'patient',
            );
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(1);
            expect(result.current.encounterDataListRD.data[0]?.id).toEqual(encounterData1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter(
                {
                    value: {
                        Reference: {
                            resourceType: 'Patient',
                            id: patient2.id,
                        },
                    },
                },
                'patient',
            );
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(1);
            expect(result.current.encounterDataListRD.data[0]?.id).toEqual(encounterData2.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('testtest', 'practitioner');
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(0);
        }

        act(() => {
            result.current.onChangeColumnFilter(null, 'patient');
        });
        await expectIsLoadingAndIsSuccess(result);

        act(() => {
            result.current.onChangeColumnFilter('victo', 'practitioner');
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.length).toEqual(1);
            expect(result.current.encounterDataListRD.data[0]?.id).toBe(encounter1.id);
        }

        act(() => {
            result.current.onResetFilters();
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter1.id)).toBeDefined();
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter2.id)).toBeDefined();
        }

        act(() => {
            result.current.onChangeColumnFilter([moment('2019-12-31'), moment('2020-01-02')], 'date');
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter1.id)).toBeDefined();
        }

        act(() => {
            result.current.onChangeColumnFilter([moment('2019-12-01'), moment('2019-12-31')], 'date');
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter1.id)).toBeUndefined();
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter2.id)).toBeUndefined();
        }

        act(() => {
            result.current.onResetFilters();
        });

        await expectIsLoadingAndIsSuccess(result);
        if (isSuccess(result.current.encounterDataListRD)) {
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter1.id)).toBeDefined();
            expect(result.current.encounterDataListRD.data.find((e) => e.id === encounter2.id)).toBeDefined();
        }
    }, 30000);
});
