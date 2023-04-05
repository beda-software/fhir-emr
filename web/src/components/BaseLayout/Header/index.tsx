import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Dropdown, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { resetInstanceToken as resetFHIRInstanceToken } from 'fhir-react/lib/services/instance';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { resetInstanceToken as resetAidboxInstanceToken } from 'aidbox-react/lib/services/instance';

import {
    dynamicActivate,
    setCurrentLocale,
    getCurrentLocale,
    locales,
} from 'shared/src/services/i18n';
import { renderHumanName } from 'shared/src/utils/fhir';

import { AvatarImage } from 'src/images/AvatarImage';
import logo from 'src/images/logo.svg';
import { logout } from 'src/services/auth';
import { sharedAuthorizedPatient, sharedAuthorizedPractitioner } from 'src/sharedState';
import { selectCurrentUserRole, Role } from 'src/utils/role';

import s from './Header.module.scss';

export interface RouteItem {
    path: string;
    exact?: boolean;
    title: string;
    icon?: React.ReactElement;
}

function LocaleSwitcher() {
    const currentLocale = getCurrentLocale();
    const localesList = Object.entries(locales);
    const items = localesList.map(([value, label]) => ({
        label: <div>{label}</div>,
        key: value,
    }));

    const onChangeLocale = ({ key }: { key: string }) => {
        setCurrentLocale(key);
        dynamicActivate(key);
    };

    return (
        <Dropdown
            menu={{ items, onClick: onChangeLocale }}
            trigger={['click']}
            className={s.locale}
            placement="bottomRight"
        >
            <a onClick={(e) => e.preventDefault()} className={s.currentLocale}>
                <GlobalOutlined className={s.localeIcon} />
                {locales[currentLocale]}
                <DownOutlined className={s.localeArrow} />
            </a>
        </Dropdown>
    );
}

export function AppHeader() {
    const location = useLocation();

    const menuItems: RouteItem[] = selectCurrentUserRole({
        [Role.Admin]: [
            { title: t`Encounters`, path: '/encounters' },
            { title: t`Patients`, path: '/patients' },
            { title: t`Practitioners`, path: '/practitioners' },
            { title: t`Questionnaires`, path: '/questionnaires' },
        ],
        [Role.Patient]: [],
    });

    const activeMenu = `/${location.pathname.split('/')[1]}`;

    return (
        <Header className={s.header}>
            <div className={s.content}>
                <Link to="/">
                    <img src={logo} alt="" />
                </Link>
                <div className={s.contentLeft}>
                    <Menu
                        mode="horizontal"
                        theme="light"
                        selectedKeys={[activeMenu!]}
                        items={renderMenu(menuItems)}
                        className={s.menu}
                    />
                    <UserMenu />
                    <LocaleSwitcher />
                </div>
            </div>
        </Header>
    );
}

function renderMenuTitle(routeItem: RouteItem) {
    return (
        <span>
            {routeItem.icon ? routeItem.icon : null}
            <span>{routeItem.title}</span>
        </span>
    );
}

export function renderMenu(menuRoutes: RouteItem[]) {
    return menuRoutes.map((route) => ({
        key: route.path,
        label: <Link to={route.path}>{renderMenuTitle(route)}</Link>,
    }));
}

function UserMenu() {
    const doLogout = useCallback(async () => {
        await logout();
        resetAidboxInstanceToken();
        resetFHIRInstanceToken();
        localStorage.clear();
        window.location.href = '/';
    }, []);

    const userMenu = [
        {
            label: t`Log out`,
            key: 'logout',
        },
    ];

    const onUserMenuClick = useCallback(
        ({ key }: { key: string }) => {
            if (key === 'logout') {
                doLogout();
            }
        },
        [doLogout],
    );

    return (
        <Dropdown
            menu={{ items: userMenu, onClick: onUserMenuClick }}
            trigger={['click']}
            placement="bottomLeft"
            arrow
        >
            <a onClick={(e) => e.preventDefault()} className={s.user}>
                <AvatarImage className={s.avatar} />
                {selectCurrentUserRole({
                    [Role.Admin]: <AdminName />,
                    [Role.Patient]: <PatientName />,
                })}
                <DownOutlined className={s.localeArrow} />
            </a>
        </Dropdown>
    );
}

function PatientName() {
    const [patient] = sharedAuthorizedPatient.useSharedState();

    return <span>{renderHumanName(patient?.name?.[0])}</span>;
}

function AdminName() {
    const [practitioner] = sharedAuthorizedPractitioner.useSharedState();

    return <span>{renderHumanName(practitioner?.name?.[0])}</span>;
}
