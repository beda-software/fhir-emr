import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Encounter, Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';

export function useEncounterDetails(encounterId: string) {
    const [encounterInfoRD] = useService(async () => {
        const response = await getFHIRResources<
            Encounter | PractitionerRole | Practitioner | Patient
        >('Encounter', {
            _id: encounterId,
            _include: [
                'Encounter:subject',
                'Encounter:participant:PractitionerRole',
                'PractitionerRole:practitioner:Practitioner',
            ],
        });
        return mapSuccess(response, (bundle) => {
            const sourceMap = extractBundleResources(bundle);
            const encounter = sourceMap.Encounter[0];
            const patient = sourceMap.Patient[0];
            const practitioner = sourceMap.Practitioner[0];
            const practitionerRole = sourceMap.PractitionerRole[0];
            return { encounter, practitioner, practitionerRole, patient };
        });
    });
    return encounterInfoRD;
}
