import { useService } from 'fhir-react/lib/hooks/service';
import { getFHIRResource } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { Patient } from 'fhir/r4b';

import { sharedAuthorizedPatient } from 'src/sharedState';
import { Role, selectCurrentUserRole } from 'src/utils/role';

export function usePatientResource(config: { id: string }) {
    return useService(async () => {
        const patientResponse = await getFHIRResource<Patient>({
            reference: `Patient/${config.id}`,
        });
        return mapSuccess(patientResponse, (patient) => {
            selectCurrentUserRole({
                [Role.Patient]: sharedAuthorizedPatient.setSharedState(patient),
                [Role.Admin]: undefined,
            });

            return patient;
        });
    });
}
