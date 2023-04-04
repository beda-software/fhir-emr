import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';

import { sharedAuthorizedPatient } from 'src/sharedState';
import { Role, selectCurrentUserRole } from 'src/utils/role';

export function usePatientResource(config: { id: string }) {
    return useService(async () => {
        const patientResponse = await getFHIRResource<Patient>({
            resourceType: 'Patient',
            id: config.id,
        });
        if (isSuccess(patientResponse)) {
            selectCurrentUserRole({
                [Role.Patient]: sharedAuthorizedPatient.setSharedState(patientResponse.data),
                [Role.Admin]: undefined,
            });
        }
        return patientResponse;
    });
}
