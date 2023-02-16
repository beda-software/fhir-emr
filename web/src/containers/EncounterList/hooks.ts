import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess, RemoteData, success } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources, WithId } from 'aidbox-react/lib/services/fhir';
import { SearchParams } from 'aidbox-react/lib/services/search';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';

import { EncounterData } from 'src/components/EncountersTable/types';
import { formatHumanDateTime } from 'src/utils/date';
import { useDebounce } from 'src/utils/debounce';

import { EncounterListFilterValues } from './types';

interface EncountersListData {
    encounterDataListRD: RemoteData<EncounterData[]>;
    reloadEncounter: () => void;
}

export function useEncounterList(
    filterValues: EncounterListFilterValues | undefined,
    searchParams: SearchParams = {},
): EncountersListData {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const [encounterDataListRD, manager] = useService<EncounterData[]>(async () => {
        const patientFilterValue = debouncedFilterValues
            ? debouncedFilterValues[0].value
            : undefined;
        const practitionerFilterValue = debouncedFilterValues
            ? debouncedFilterValues[1].value
            : undefined;
        const dateFilterValue = debouncedFilterValues ? debouncedFilterValues[2].value : undefined;

        const patientsBundleResponse = patientFilterValue
            ? await getFHIRResources<Patient>('Patient', {
                  name: patientFilterValue,
              })
            : success(undefined);
        const patients =
            isSuccess(patientsBundleResponse) && patientsBundleResponse.data
                ? extractBundleResources<Patient>(patientsBundleResponse.data).Patient
                : [];

        const practitionersBundleResponse = practitionerFilterValue
            ? await getFHIRResources<Practitioner>('Practitioner', {
                  name: practitionerFilterValue,
              })
            : success(undefined);
        const practitioners =
            isSuccess(practitionersBundleResponse) && practitionersBundleResponse.data
                ? extractBundleResources<Practitioner>(practitionersBundleResponse.data)
                      .Practitioner
                : [];

        const practitionerRolesBundleResponse =
            practitioners && practitioners.length > 0
                ? await getFHIRResources<PractitionerRole>('PractitionerRole', {
                      practitioner: practitioners.map((practitioner) => practitioner.id).join(','),
                  })
                : success(undefined);
        const practitionerRoles =
            isSuccess(practitionerRolesBundleResponse) && practitionerRolesBundleResponse.data
                ? extractBundleResources<PractitionerRole>(practitionerRolesBundleResponse.data)
                      .PractitionerRole
                : [];

        const filteredResourcesAreFound =
            (!patientFilterValue || patients.length > 0) &&
            (!practitionerFilterValue || practitionerRoles.length > 0);

        const response = filteredResourcesAreFound
            ? await getFHIRResources<Encounter | PractitionerRole | Practitioner | Patient>(
                  'Encounter',
                  {
                      ...searchParams,
                      _include: [
                          'Encounter:subject',
                          'Encounter:participant:PractitionerRole',
                          'PractitionerRole:practitioner:Practitioner',
                      ],
                      subject:
                          patients !== undefined
                              ? patients.map((patient) => `Patient/${patient.id}`).join(',')
                              : undefined,
                      participant:
                          practitionerRoles !== undefined
                              ? practitionerRoles
                                    .map((role) => `PractitionerRole/${role.id}`)
                                    .join(',')
                              : undefined,
                      date: dateFilterValue
                          ? [
                                `ge${formatFHIRDateTime(dateFilterValue[0])}`,
                                `le${formatFHIRDateTime(dateFilterValue[1])}`,
                            ]
                          : undefined,
                  },
              )
            : success(undefined);

        return mapSuccess(response, (bundle) => {
            const sourceMap = bundle
                ? extractBundleResources(bundle)
                : { Encounter: [], Patient: [], Practitioner: [], PractitionerRole: [] };

            const encounters = sourceMap.Encounter;
            const patients = sourceMap.Patient;
            const practitioners = sourceMap.Practitioner;
            const practitionerRoles = sourceMap.PractitionerRole;

            return encounters.map((encounter) => {
                const patient: WithId<Patient> | undefined = patients.find(
                    (p) => p.id === encounter.subject?.id,
                );
                const practitionerRole = practitionerRoles.find(
                    (pR) => pR.id === encounter.participant?.[0]!.individual?.id,
                );

                const practitioner: WithId<Practitioner> | undefined = practitioners.find(
                    (p) => p.id === practitionerRole?.practitioner?.id,
                );

                return {
                    id: encounter.id,
                    patient,
                    practitioner,
                    status: encounter.status,
                    date: encounter?.period?.start,
                    humanReadableDate:
                        encounter?.period?.start && formatHumanDateTime(encounter?.period?.start),
                };
            });
        });
    }, [debouncedFilterValues]);

    return { encounterDataListRD, reloadEncounter: manager.softReloadAsync };
}
