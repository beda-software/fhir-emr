import { t } from '@lingui/macro';
import { Menu } from 'antd';
import { Practitioner, PractitionerRole } from 'fhir/r4b';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { BasePageHeader } from 'src/components/BaseLayout';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { Title } from 'src/components/Typography';
import { renderHumanName } from 'src/utils/fhir';

import s from './PractitionerHeader.module.scss';

interface BreadCrumb {
    name: string;
    path?: string;
}

interface Props {
    practitioner: WithId<Practitioner>;
    practitionerRole?: WithId<PractitionerRole>;
}

/**
 * @deprecated
 */
function usePractitionerHeader(props: Props) {
    const { practitioner } = props;
    const pageTitle = useMemo(() => renderHumanName(practitioner.name?.[0]), [practitioner]);
    const params = useParams<{ id: string }>();
    const location = useLocation();
    const rootPath = useMemo(() => `/practitioners/${params.id}`, [params.id]);

    const breadcrumbsMap = useMemo(
        () => ({
            '/practitioners': t`Practitioners`,
            [rootPath]: pageTitle,
            [`${rootPath}/scheduling`]: t`Scheduling`,
            [`${rootPath}/availability`]: t`Availability`,
        }),
        [pageTitle, rootPath],
    );

    const breadcrumbs: BreadCrumb[] = useMemo(() => {
        const isRoot = rootPath === location?.pathname;
        const paths = _.toPairs(breadcrumbsMap);

        const result = _.chain(paths)
            .map(([path, name]) => (location?.pathname.includes(path) ? [path, name] : undefined))
            .compact()
            .sortBy(([path]) => path)
            .map(([path, name]) => ({ path, name }))
            .value() as BreadCrumb[];

        return isRoot ? [...result, { name: t`Overview` }] : result;
    }, [location?.pathname, breadcrumbsMap, rootPath]);

    return { pageTitle, breadcrumbs };
}

/**
 * @deprecated
 */
export function PractitionerHeader(props: Props) {
    console.warn(
        'DEPRECATED: Do not use PractitionerHeader component. It will be removed in future versions of the EMR.',
    );
    console.warn('Use PractitionerDetailsTabs instead.');

    const { practitionerRole } = props;
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const { pageTitle, breadcrumbs } = usePractitionerHeader(props);

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

    const renderMenu = () => {
        return (
            <Menu
                mode="horizontal"
                theme="light"
                selectedKeys={[currentPath.split('/').slice(0, 4).join('/')]}
                className={s.menu}
                items={menuItems.map((route) => ({
                    key: route.path,
                    label: route.disabled ? route.label : <Link to={route.path}>{route.label}</Link>,
                    disabled: route.disabled,
                }))}
            />
        );
    };

    return (
        <BasePageHeader style={{ paddingBottom: 0 }}>
            <Breadcrumbs crumbs={breadcrumbs} />
            <Title style={{ marginBottom: 21 }}>{pageTitle}</Title>
            {renderMenu()}
        </BasePageHeader>
    );
}
