import { useService } from 'fhir-react/lib/hooks/service';
import { getFHIRResource } from 'fhir-react/lib/services/fhir';
import { Patient } from 'fhir/r4b';

export function usePatientResource(config: { id: string }) {
    return useService(async () =>
        getFHIRResource<Patient>({
            reference: `Patient/${config.id}`,
        }),
    );
}
