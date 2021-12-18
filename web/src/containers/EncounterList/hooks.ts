import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { SearchParams } from 'aidbox-react/lib/services/search';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { formatHumanDateTime } from '../../utils/date';
import { getEncounterStatus } from '../../utils/format';

export function useEncounterList(searchParams: SearchParams) {
    const [encounterDataListRD] = useService(async () => {
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
                const patient = patients.find((p) => p.id === encounter.subject?.id);
                const practitionerRole = practitionerRoles.find(
                    (pR) => pR.id === encounter.participant?.[0].individual?.id,
                );
                const practitioner = practitioners.find(
                    (p) => p.id === practitionerRole?.practitioner?.id,
                );
                return {
                    key: encounter.id,
                    patient: renderHumanName(patient?.name?.[0]),
                    practitioner: renderHumanName(practitioner?.name?.[0]),
                    status: getEncounterStatus(encounter.status),
                    date: encounter?.period?.start && formatHumanDateTime(encounter?.period?.start),
                };
            });
        });
    });
    return encounterDataListRD;
}
