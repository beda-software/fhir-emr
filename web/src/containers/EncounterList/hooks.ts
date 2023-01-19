import { useService } from 'aidbox-react/lib/hooks/service';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources, WithId } from 'aidbox-react/lib/services/fhir';
import { SearchParams } from 'aidbox-react/lib/services/search';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

import { EncounterData } from './types';

interface EncountersListData {
    encounterDataListRD: RemoteData<EncounterData[]>;
    reloadEncounter: () => void;
}

export function useEncounterList(searchParams: SearchParams): EncountersListData {
    const [encounterDataListRD, manager] = useService<EncounterData[]>(async () => {
        const response = await getFHIRResources<
            Encounter | PractitionerRole | Practitioner | Patient
        >('Encounter', {
            ...searchParams,
            _include: [
                'Encounter:subject',
                'Encounter:participant:PractitionerRole',
                'PractitionerRole:practitioner:Practitioner',
            ],
        });

        return mapSuccess(response, (bundle) => {
            const sourceMap = extractBundleResources(bundle);
            const encounters = sourceMap.Encounter;
            const patients = sourceMap.Patient;
            const practitioners = sourceMap.Practitioner;
            const practitionerRoles = sourceMap.PractitionerRole;

            return encounters.map((encounter) => {
                const patient: WithId<Patient> | undefined = patients.find((p) => p.id === encounter.subject?.id);
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
    });

    return { encounterDataListRD, reloadEncounter: manager.reload };
}
