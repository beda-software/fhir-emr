import { Encounter } from 'fhir/r4b';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { RenderRemoteData, useService } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { getFHIRResource } from 'src/services/fhir';

export function EncounterClinicalContext({ children }: { children: ReactNode }) {
    const { encounterId } = useParams<{ encounterId: string }>();

    const [encounterRD] = useService(
        () => getFHIRResource<Encounter>({ reference: `Encounter/${encounterId!}` }),
        [encounterId],
    );

    return (
        <RenderRemoteData remoteData={encounterRD} renderLoading={Spinner}>
            {(encounter) => (
                <ClinicalContext
                    context={[
                        { name: 'Encounter', resource: encounter },
                        { name: 'encounter', resource: encounter },
                        { name: 'CurrentEncounter', resource: encounter },
                    ]}
                >
                    {children}
                </ClinicalContext>
            )}
        </RenderRemoteData>
    );
}
