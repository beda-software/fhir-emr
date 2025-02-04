import { Provenance, Reference, Resource } from 'fhir/r4b';
import { fromFHIRReference } from 'sdc-qrf';

import { compileAsFirst } from 'src/utils';

const getProvenanceEntityUriByRole = (role: string) =>
    compileAsFirst<Provenance, string>(`Provenance.entity.where(role='${role}').what.uri`);

const getProvenanceEntityReferenceByRole = (role: string) =>
    compileAsFirst<Provenance, Reference>(`Provenance.entity.where(role='${role}').what`);

const getProvenanceEntityUriSource = getProvenanceEntityUriByRole('source');
const getProvenanceEntityReferenceSource = getProvenanceEntityReferenceByRole('source');

export function getSourceFromProvenance(provenance?: Provenance): Resource | undefined {
    if (!provenance) {
        return undefined;
    }

    const qrURI = getProvenanceEntityUriSource(provenance);
    if (qrURI) {
        const qrResourceType = qrURI.split('/')[0] ?? '';
        const qrId = qrURI.split('/')[1];
        return { resourceType: qrResourceType, id: qrId };
    }

    const qrReference = getProvenanceEntityReferenceSource(provenance);
    if (qrReference) {
        return {
            resourceType: fromFHIRReference(qrReference)?.resourceType,
            id: fromFHIRReference(qrReference)?.id,
        };
    }

    return undefined;
}
