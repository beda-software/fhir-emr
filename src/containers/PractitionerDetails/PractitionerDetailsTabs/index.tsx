import { t } from '@lingui/macro';
import { Practitioner, PractitionerRole } from 'fhir/r4b';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { Tabs } from 'src/components/Tabs';

interface Props {
    practitioner: WithId<Practitioner>;
    practitionerRole?: WithId<PractitionerRole>;
}

export function PractitionerDetailsTabs(props: Props) {
    const { practitionerRole } = props;
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const navigate = useNavigate();

    const menuItems: RouteItem[] = useMemo(
        () => [
            { label: t`Overview`, path: `/practitioners/${params.id}` },
            { label: t`Scheduling`, path: `/practitioners/${params.id}/scheduling`, disabled: !practitionerRole },
            { label: t`Availability`, path: `/practitioners/${params.id}/availability`, disabled: !practitionerRole },
        ],
        [params.id, practitionerRole],
    );

    const [currentPath, setCurrentPath] = useState(location?.pathname);

    useEffect(() => {
        setCurrentPath(location?.pathname);
    }, [location]);

    return (
        <Tabs
            boxShadow={false}
            activeKey={currentPath.split('/').slice(0, 4).join('/')}
            items={menuItems.map((route) => ({
                key: route.path,
                label: <Link to={route.path}>{route.label}</Link>,
            }))}
            onTabClick={(path) => navigate(path)}
        />
    );
}
