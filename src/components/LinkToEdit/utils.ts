import { Provenance, Resource } from 'fhir/r4b';
import { fromFHIRReference } from 'sdc-qrf';

export function getResourceTypeAndIdFromProvenance(provenance?: Provenance): Resource {
    if (provenance?.entity?.[0]?.what && 'uri' in provenance.entity[0].what) {
        const qrURI = provenance.entity[0].what as { uri: string };
        const qrResourceType = qrURI.uri.split('/')[0] ?? '';
        const qrId = qrURI.uri.split('/')[1];
        return { resourceType: qrResourceType, id: qrId };
    }
    return {
        resourceType: fromFHIRReference(provenance?.entity?.[0]?.what)?.resourceType,
        id: fromFHIRReference(provenance?.entity?.[0]?.what)?.id,
    };
}
