import { Provenance } from 'fhir/r4b';
import { fromFHIRReference } from 'sdc-qrf';

export type GetLinkToEditUrlProps = {
    provenance?: Provenance;
    pathname?: string;
    to?: string;
};

export function getLinkToEditUrl(props: GetLinkToEditUrlProps): string | undefined {
    const { provenance, pathname, to } = props;

    const entity = provenance?.entity?.[0]?.what;
    const qrId = fromFHIRReference(entity)?.id;
    const baseUrl = pathname?.split('/').slice(0, 3).join('/');

    if (!qrId) {
        return undefined;
    }

    if (to) {
        return `${to}/${qrId}`;
    }

    if (!baseUrl) {
        return undefined;
    }

    return `${baseUrl}/documents/${qrId}`;
}
