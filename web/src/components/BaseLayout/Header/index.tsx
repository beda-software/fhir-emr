import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Dropdown, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { Link, useLocation } from 'react-router-dom';

import { resetInstanceToken } from 'aidbox-react/lib/services/instance';

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
import { sharedAuthorizedPractitioner } from 'src/sharedState';

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
    const doLogout = async () => {
        await logout();
        resetInstanceToken();
        localStorage.clear();
        window.location.href = '/';
    };

    const location = useLocation();

    const menuItems: RouteItem[] = [
        { title: t`Encounters`, path: '/encounters' },
        { title: t`Patients`, path: '/patients' },
        { title: t`Practitioners`, path: '/practitioners' },
        { title: t`Questionnaires`, path: '/questionnaires' },
    ];

    const activeMenu = `/${location.pathname.split('/')[1]}`;

    const renderUserMenu = () => {
        const userMenu = [
            {
                label: t`Log out`,
                key: 'logout',
            },
        ];

        const onUserMenuClick = ({ key }: { key: string }) => {
            if (key === 'logout') {
                doLogout();
            }
        };

        const practitionerData = sharedAuthorizedPractitioner.getSharedState();
        const practitionerName = practitionerData?.name?.[0];

        return (
            <Dropdown
                menu={{ items: userMenu, onClick: onUserMenuClick }}
                trigger={['click']}
                placement="bottomLeft"
                arrow
            >
                <a onClick={(e) => e.preventDefault()} className={s.user}>
                    <AvatarImage className={s.avatar} />
                    <span>{renderHumanName(practitionerName)}</span>
                    <DownOutlined className={s.localeArrow} />
                </a>
            </Dropdown>
        );
    };

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
                    {renderUserMenu()}
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
