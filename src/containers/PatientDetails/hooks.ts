import { Patient } from 'fhir/r4b';

import { useService } from '@beda.software/fhir-react';

import { getFHIRResource } from 'src/services/fhir';

export function usePatientResource(config: { id: string }) {
    return useService(async () =>
        getFHIRResource<Patient>({
            reference: `Patient/${config.id}`,
        }),
    );
}
