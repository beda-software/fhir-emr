import { t } from '@lingui/macro';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';

import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { Tabs } from 'src/components/Tabs';

export function PatientDetailsTabs(props: { extraMenuItems?: RouteItem[]; isDefaultRoutesDisabled?: boolean }) {
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const { extraMenuItems = [] } = props;
    const navigate = useNavigate();

    const menuItems: RouteItem[] = useMemo(
        () =>
            (!props.isDefaultRoutesDisabled
                ? [
                      { label: t`Overview`, path: `/patients/${params.id}` },
                      { label: t`Encounters`, path: `/patients/${params.id}/encounters` },
                      { label: t`Documents`, path: `/patients/${params.id}/documents` },
                      { label: t`Wearables`, path: `/patients/${params.id}/wearables` },
                      { label: t`Orders`, path: `/patients/${params.id}/orders` },
                      { label: t`Smart Apps`, path: `/patients/${params.id}/apps` },
                      { label: t`Resources`, path: `/patients/${params.id}/resources` },
                  ]
                : []
            ).concat(
                extraMenuItems.map(({ label, path }) => ({
                    label,
                    path: `/patients/${params.id}` + path,
                })),
            ),
        [props.isDefaultRoutesDisabled, params.id, extraMenuItems],
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
