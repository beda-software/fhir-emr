import { Resource, Provenance } from 'fhir/r4b';
import { Link, useLocation } from 'react-router-dom';

import { useLinkToEdit } from 'src/components/LinkToEdit/hooks';
import { getResourceTypeAndIdFromProvenance } from 'src/components/LinkToEdit/utils';

interface LinkToEditProps {
    name?: string;
    resource: Resource;
    provenanceList?: Provenance[];
    to?: string;
}

export function LinkToEdit(props: LinkToEditProps) {
    const { name, resource, to } = props;
    const location = useLocation();
    const provenance = useLinkToEdit({ resourceId: resource.id });

    if (provenance) {
        // const pathname = location.pathname.split('/').slice(0, -1).join('/');
        const pathname = location.pathname.split('/').slice(0, 3).join('/');
        const { id: qrId } = getResourceTypeAndIdFromProvenance(provenance);
        return <Link to={to ? `${to}/${qrId}` : `${pathname}/documents/${qrId}`}>{name}</Link>;
    }
    // }

    return <>{name}</>;
}
