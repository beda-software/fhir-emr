
import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';


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

export function useNavigateToEncounter() {
    const navigate = useNavigate();

    const navigateToEncounter = (patientId: string, encounterId: string) => {
        navigate(`/patients/${patientId}/encounters/${encounterId}`);
    }

    return { navigateToEncounter }
}
