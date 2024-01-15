import { Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';

export function useEncounterDetails(encounterId: string) {
    const [encounterInfoRD] = useService(async () => {
        const response = await getFHIRResources<Encounter | PractitionerRole | Practitioner | Patient>('Encounter', {
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

export function useNavigateToEncounter() {
    const navigate = useNavigate();

    const navigateToEncounter = (patientId: string, encounterId: string) => {
        navigate(`/patients/${patientId}/encounters/${encounterId}`);
    };

    return { navigateToEncounter };
}
