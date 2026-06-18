import { Patient } from 'fhir/r4b';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { RenderRemoteData, useService } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { getFHIRResource } from 'src/services/fhir';

export function PrintPatientClinicalContext({ children }: { children: ReactNode }) {
    const { id: patientId } = useParams<{ id: string }>();

    const [patientRD] = useService(() => getFHIRResource<Patient>({ reference: `Patient/${patientId!}` }), [patientId]);

    return (
        <RenderRemoteData remoteData={patientRD} renderLoading={Spinner}>
            {(patient) => (
                <ClinicalContext
                    context={[
                        { name: 'Patient', resource: patient },
                        { name: 'patient', resource: patient },
                    ]}
                >
                    {children}
                </ClinicalContext>
            )}
        </RenderRemoteData>
    );
}
