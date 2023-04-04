import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { Patient } from 'fhir/r4b';

import { sharedAuthorizedPatient } from 'src/sharedState';
import { Role, selectCurrentUserRole } from 'src/utils/role';

export function usePatientResource(config: { id: string }) {
    return useService(async () => {
        const patientResponse = await getFHIRResources<Patient>('Patient', {
            resourceType: 'Patient',
            id: config.id,
        });
        return mapSuccess(patientResponse, (bundle) => {
            const patient = extractBundleResources(bundle).Patient[0]!;

            selectCurrentUserRole({
                [Role.Patient]: sharedAuthorizedPatient.setSharedState(patient),
                [Role.Admin]: undefined,
            });

            return patient;
        });
    });
}
