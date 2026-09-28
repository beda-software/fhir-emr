import { Bundle, ParametersParameter, Provenance, QuestionnaireResponse } from 'fhir/r4b';
import { ReactNode } from 'react';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';
import { isSuccess, success } from '@beda.software/remote-data';

import { Spinner } from 'src/components/Spinner';
import { getProvenanceByEntity } from 'src/services/provenance';

export function ProvenanceClinicalContext({
    questionnaireResponse,
    children,
}: {
    questionnaireResponse?: Partial<QuestionnaireResponse>;
    children: ReactNode;
}) {
    const qrId = questionnaireResponse?.id;
    const resourceType = questionnaireResponse?.resourceType ?? 'QuestionnaireResponse';

    const [response] = useService(async () => {
        if (!qrId) {
            return success({ context: [] as ParametersParameter[] });
        }

        const uri = `${resourceType}/${qrId}`;
        const provenanceResponse = await getProvenanceByEntity<WithId<Provenance>>(uri);
        if (!isSuccess(provenanceResponse)) {
            return provenanceResponse;
        }

        const provenances = provenanceResponse.data;
        const latestSortedProvenances = [...provenances].sort((a, b) => b.recorded.localeCompare(a.recorded));
        const latestProvenance = latestSortedProvenances[0];

        const provenanceBundle: Bundle<WithId<Provenance>> = {
            resourceType: 'Bundle',
            type: 'collection',
            entry: provenances.map((provenance) => ({ resource: provenance })),
        };

        const context: ParametersParameter[] = [
            ...(latestProvenance ? [{ name: 'Provenance', resource: latestProvenance }] : []),
            ...(provenances.length ? [{ name: 'ProvenanceBundle', resource: provenanceBundle }] : []),
        ];

        return success({ context });
    }, [qrId, resourceType]);

    if (!qrId) {
        return <>{children}</>;
    }

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ context }) => <ClinicalContext context={context}>{children}</ClinicalContext>}
        </RenderRemoteData>
    );
}
