import { t } from '@lingui/macro';
import { Menu } from 'antd';
import { Patient } from 'fhir/r4b';
import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import { BasePageHeader } from 'src/components/BaseLayout';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { Title } from 'src/components/Typography';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { BreadCrumb, PatientHeaderContext } from './context';
import s from './PatientHeader.module.scss';
export { usePatientHeaderLocationTitle } from './hooks';

/**
 * @deprecated
 */
export function PatientHeaderContextProvider(props: React.HTMLAttributes<HTMLDivElement> & { patient: Patient }) {
    console.warn(
        'DEPRECATED: Do not use PatientHeaderContextProvider. It will be removed in future versions of the EMR.',
    );

    const { children, patient } = props;
    const [pageTitle] = useState(renderHumanName(patient.name?.[0]));
    const params = useParams<{ id: string }>();
    const location = useLocation();
    const rootPath = useMemo(() => `/patients/${params.id}`, [params.id]);

    const [breadcrumbsMap, setBreadcrumbs] = useState({
        '/patients': t`Patients`,
        [rootPath]: renderHumanName(patient.name?.[0]),
    });

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

    return (
        <PatientHeaderContext.Provider
            value={{
                title: pageTitle,
                breadcrumbs,
                setBreadcrumbs: (newPath) => {
                    const pathNames = breadcrumbs.map((b) => b.name);
                    const newPathName = _.toPairs(newPath)[0]?.[1];
                    if (newPathName && pathNames.includes(newPathName)) {
                        return;
                    }

                    setBreadcrumbs((prevValue) => ({
                        ...prevValue,
                        ...newPath,
                    }));
                },
            }}
        >
            {children}
        </PatientHeaderContext.Provider>
    );
}

/**
 * @deprecated
 */
export function PatientHeader(props: { extraMenuItems?: RouteItem[]; isDefaultRoutesDisabled?: boolean }) {
    console.warn('DEPRECATED: Do not use PatientHeader component. It will be removed in future versions of the EMR.');
    console.warn('Use PatientDetailsTabs instead.');

    const location = useLocation();
    const params = useParams<{ id: string }>();
    const { title, breadcrumbs } = useContext(PatientHeaderContext);
    const { extraMenuItems = [] } = props;

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

    const renderMenu = () => {
        return (
            <Menu
                mode="horizontal"
                theme="light"
                selectedKeys={[currentPath.split('/').slice(0, 4).join('/')]}
                className={s.menu}
                items={menuItems.map((route) => ({
                    key: route.path,
                    label: <Link to={route.path}>{route.label}</Link>,
                }))}
            />
        );
    };

    return (
        <BasePageHeader style={{ paddingBottom: 0 }}>
            <Breadcrumbs
                crumbs={matchCurrentUserRole({
                    [Role.Admin]: () => breadcrumbs,
                    [Role.Patient]: () => breadcrumbs.slice(1),
                    [Role.Practitioner]: () => breadcrumbs,
                    [Role.Receptionist]: () => breadcrumbs,
                })}
            />
            <Title style={{ marginBottom: 21 }}>{title}</Title>
            {renderMenu()}
        </BasePageHeader>
    );
}
