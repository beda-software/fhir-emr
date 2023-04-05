import { t } from '@lingui/macro';
import { Menu } from 'antd';
import Title from 'antd/es/typography/Title';
import { WithId } from 'fhir-react/lib/services/fhir';
import { Practitioner } from 'fhir/r4b';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageHeader } from 'src/components/BaseLayout';
import { RouteItem } from 'src/components/BaseLayout/Header';
import Breadcrumbs from 'src/components/Breadcrumbs';

import s from './PractitionerHeader.module.scss';

interface BreadCrumb {
    name: string;
    path?: string;
}

interface Props {
    practitioner: WithId<Practitioner>;
}

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

        return isRoot ? [...result, { name: 'Overview' }] : result;
    }, [location?.pathname, breadcrumbsMap, rootPath]);

    return { pageTitle, breadcrumbs };
}

export function PractitionerHeader(props: Props) {
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const { pageTitle, breadcrumbs } = usePractitionerHeader(props);

    const menuItems: RouteItem[] = useMemo(
        () => [
            { title: t`Overview`, path: `/practitioners/${params.id}` },
            { title: t`Scheduling`, path: `/practitioners/${params.id}/scheduling` },
            { title: t`Availability`, path: `/practitioners/${params.id}/availability` },
        ],
        [params.id],
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
                    label: <Link to={route.path}>{route.title}</Link>,
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
