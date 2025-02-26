import { Resource, Provenance } from 'fhir/r4b';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fromFHIRReference } from 'sdc-qrf';

import { LinkToEditContext } from 'src/components/LinkToEdit/context';

interface LinkToEditProps {
    name?: string;
    resource: Resource;
    provenanceList: Provenance[];
    to?: string;
}

export function LinkToEdit(props: LinkToEditProps) {
    const { name, resource, provenanceList, to } = props;

    const location = useLocation();
    const provenance = provenanceList
        .filter((provenance) =>
            provenance.target.find(
                (target) =>
                    fromFHIRReference(target)?.id === resource.id &&
                    fromFHIRReference(target)?.resourceType === resource.resourceType,
            ),
        )
        .sort((a, b) => new Date(b.recorded).getTime() - new Date(a.recorded).getTime())[0];

    const { getLinkToEditUrl } = useContext(LinkToEditContext);

    const customPathTo = getLinkToEditUrl({ provenance, pathname: location.pathname, to });

    if (!customPathTo) {
        return <>{name}</>;
    }

    return <Link to={`${customPathTo}`}>{name}</Link>;
}
