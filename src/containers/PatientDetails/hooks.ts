import { CarePlan, Patient } from 'fhir/r4b';

import { WithId, extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';

export interface PatientInformation {
    patient: WithId<Patient>;
    carePlans: WithId<CarePlan>[];
}

export function usePatientResource(config: { id: string }) {
    return useService(
        async () =>
            mapSuccess(
                await getFHIRResources<Patient | CarePlan>('Patient', {
                    _id: config.id,
                    _revinclude: ['CarePlan:subject'],
                }),
                (bundle): PatientInformation => {
                    const { Patient, CarePlan } = extractBundleResources(bundle);
                    return { patient: Patient[0]!, carePlans: CarePlan };
                },
            ),
        [config.id],
    );
}
