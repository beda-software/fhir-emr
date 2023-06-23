import { t } from '@lingui/macro';
import { Menu } from 'antd';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import logoCompanyName from 'src/icons/brand/company-name.svg';
import logoSmall from 'src/icons/brand/logo-small.svg';
import encountersIcon from 'src/icons/menu/encounters.svg';
import patientsIcon from 'src/icons/menu/patients.svg';
import practitionersIcon from 'src/icons/menu/practitioners.svg';
import questionnairesIcon from 'src/icons/menu/questionnaires.svg';
import { Role, matchCurrentUserRole } from 'src/utils/role';

import s from './SidebarTop.module.scss';
import { S } from './SidebarTop.styles';

export interface RouteItem {
    path: string;
    exact?: boolean;
    label: string;
    icon?: React.ReactElement;
    disabled?: boolean;
    className?: string;
}

interface Props {
    collapsed: boolean;
}

export function SidebarTop(props: Props) {
    const location = useLocation();
    const { collapsed } = props;

    const menuItems: RouteItem[] = matchCurrentUserRole({
        [Role.Admin]: () => [
            { label: t`Encounters`, path: '/encounters', icon: <img src={encountersIcon} alt="" /> },
            { label: t`Patients`, path: '/patients', icon: <img src={patientsIcon} alt="" /> },
            { label: t`Practitioners`, path: '/practitioners', icon: <img src={practitionersIcon} alt="" /> },
            { label: t`Questionnaires`, path: '/questionnaires', icon: <img src={questionnairesIcon} alt="" /> },
        ],
        [Role.Patient]: () => [],
    });

    const activeMenu = `/${location.pathname.split('/')[1]}`;

    return (
        <S.Container
            className={classNames(s.container, {
                _collapsed: collapsed,
            })}
        >
            <Link to="/" className={s.logoWrapper}>
                <img src={logoSmall} alt="" />
                <img src={logoCompanyName} className={s.logoCompanyName} alt="" />
            </Link>
            <div className={s.divider} />
            <Menu
                mode="inline"
                theme="light"
                selectedKeys={[activeMenu!]}
                items={renderTopMenu(menuItems)}
                className={s.menu}
                inlineCollapsed={collapsed}
            />
        </S.Container>
    );
}

function renderTopMenu(menuRoutes: RouteItem[]) {
    return menuRoutes.map((route) => ({
        key: route.path,
        label: (
            <Link to={route.path} className={s.menuLink}>
                <div className={s.menuLinkRow}>
                    {route.icon ? route.icon : null}
                    <span className={s.menuItemLabel}>{route.label}</span>
                </div>
                <span className={classNames(s.menuItemLabel, s._small)}>{route.label}</span>
            </Link>
        ),
        className: s.menuItem,
    }));
}
