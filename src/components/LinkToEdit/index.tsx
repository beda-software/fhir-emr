import { Resource, Provenance } from 'fhir/r4b';
import { Link, useLocation } from 'react-router-dom';

import { useLinkToEdit } from 'src/components/LinkToEdit/hooks';
import { getSourceFromProvenance } from 'src/components/LinkToEdit/utils';

interface LinkToEditProps {
    name?: string;
    resource: Resource;
    provenanceList?: Provenance[];
    to?: string;
    customPathTo?: (props: {
        provenance: Provenance;
        customEntityResourceExtract: (provenance: Provenance) => Resource | undefined;
    }) => string;
    customEntityResourceExtract?: (provenance?: Provenance) => Resource | undefined;
}

export function LinkToEdit(props: LinkToEditProps) {
    const { name, resource, to, customPathTo, customEntityResourceExtract } = props;
    const location = useLocation();
    const provenance = useLinkToEdit({ resourceId: resource.id });

    if (!provenance) {
        return <>{name}</>;
    }

    if (customPathTo) {
        return (
            <Link
                to={customPathTo({
                    provenance,
                    customEntityResourceExtract: customEntityResourceExtract
                        ? customEntityResourceExtract
                        : getSourceFromProvenance,
                })}
            >
                {name}
            </Link>
        );
    }

    const pathname = location.pathname.split('/').slice(0, 3).join('/');
    const entityResource = getSourceFromProvenance(provenance);
    const qrId = entityResource?.id;
    return <Link to={to ? `${to}/${qrId}` : `${pathname}/documents/${qrId}`}>{name}</Link>;
}
