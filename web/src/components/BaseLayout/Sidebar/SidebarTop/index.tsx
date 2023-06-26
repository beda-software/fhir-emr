import { t } from '@lingui/macro';
import { Menu } from 'antd';
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    collapsed: boolean;
    onItemClick?: () => void;
}

export function SidebarTop(props: Props) {
    const location = useLocation();
    const { collapsed, onItemClick, ...other } = props;
    const navigate = useNavigate();

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
    const onMenuItemClick = (path: string) => {
        onItemClick?.();
        navigate(path);
    };

    return (
        <S.Container
            $collapsed={collapsed}
            className={classNames(s.container, {
                _collapsed: collapsed,
            })}
            {...other}
        >
            <Link to="/" className={s.logoWrapper}>
                <img src={logoSmall} alt="" />
                <img src={logoCompanyName} className={s.logoCompanyName} alt="" />
            </Link>
            <S.Divider />
            <Menu
                mode="inline"
                theme="light"
                selectedKeys={[activeMenu!]}
                items={renderTopMenu(menuItems, onMenuItemClick)}
                className={s.menu}
                inlineCollapsed={collapsed}
            />
        </S.Container>
    );
}

function renderTopMenu(menuRoutes: RouteItem[], onItemClick: (path: string) => void) {
    return menuRoutes.map((route) => ({
        key: route.path,
        icon: route.icon,
        onClick: () => onItemClick(route.path),
        label: (
            <div className={s.menuLink}>
                <span className={s.menuItemLabel}>{route.label}</span>
                <span className={classNames(s.menuItemLabel, s._small)}>{route.label}</span>
            </div>
        ),
        className: s.menuItem,
    }));
}
