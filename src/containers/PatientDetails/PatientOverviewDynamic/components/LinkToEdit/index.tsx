import { Resource, Provenance } from 'fhir/r4b';
import { Link } from 'react-router-dom';
import { fromFHIRReference } from 'sdc-qrf';

interface LinkToEditProps {
    name?: string;
    resource: Resource;
    provenanceList: Provenance[];
    to?: string;
}
export function LinkToEdit(props: LinkToEditProps) {
    const { name, resource, provenanceList, to } = props;
    /* const location = useLocation(); */
    const provenance = provenanceList.find((provenance) => {
        const targets = provenance.target || [];

        return targets.find((target) => {
            return (
                fromFHIRReference(target)?.id === resource.id &&
                fromFHIRReference(target)?.resourceType === resource.resourceType
            );
        });
    });
    const entity = provenance?.entity?.[0]?.what;
    const qrId = fromFHIRReference(entity)?.id;

    if (qrId) {
        return <Link to={to ? `${to}/${qrId}` : `./documents/${qrId}`}>{name}</Link>;
    }

    return <>{name}</>;
}
