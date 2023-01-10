import { t, Trans } from '@lingui/macro';
import { Button, Menu, Radio } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { resetInstanceToken } from 'aidbox-react/lib/services/instance';

import {
    dynamicActivate,
    setCurrentLocale,
    getCurrentLocale,
    locales,
} from 'shared/src/services/i18n';
import { renderHumanName } from 'shared/src/utils/fhir';

import { AvatarImage } from 'src/images/AvatarImage';
import { LogoImage } from 'src/images/LogoImage';
import { logout } from 'src/services/auth';
import s from './Header.module.scss';

export interface RouteItem {
    path: string;
    exact?: boolean;
    title: string;
    icon?: React.ReactElement;
}

function LocaleSwitcher() {
    const currentLocale = getCurrentLocale();
    return (
        <Radio.Group
            value={currentLocale}
            size="small"
            onChange={(e) => {
                setCurrentLocale(e.target.value);
                dynamicActivate(e.target.value);
            }}
        >
            {Object.entries(locales).map(([value, label], index) => (
                <Radio.Button key={index} value={value}>
                    {label}
                </Radio.Button>
            ))}
        </Radio.Group>
    );
}

export function AppHeader() {
    const doLogout = async () => {
        await logout();
        resetInstanceToken();
        localStorage.clear();
        window.location.href = '/';
    };

    const menuItems: RouteItem[] = [
        { title: t`Encounters`, path: '/encounters' },
        { title: t`Patients`, path: '/patients' },
        { title: t`Practitioners`, path: '/practitioners' },
        { title: t`Questionnaires`, path: '/questionnaires' },
    ];

    const menuDefaultSelectedKeys = getActiveKeys(menuItems).map(
        ({ path, title }) => path || title,
    );

    return (
        <Header className={s.header}>
            <div className={s.headerContent}>
                <LogoImage style={titleStyle} />
                <div style={rightSideStyle}>
                    <Menu
                        mode="horizontal"
                        theme="light"
                        selectedKeys={menuDefaultSelectedKeys}
                        style={{ width: 400 }}
                        items={renderMenu(menuItems)}
                    />
                    <Button onClick={doLogout} style={exitStyle}>
                        <Trans>Log out</Trans>
                    </Button>
                    <AvatarImage style={avatarStyle} />

                    <span style={titleStyle}>{renderHumanName()}</span>
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

function getActiveKeys(menuRoutes: RouteItem[]): RouteItem[] {
    return menuRoutes.filter(({ path }) => {
        if (path) {
            return location.pathname === path || location.pathname.startsWith(`${path}/`);
        }

        return false;
    });
}

const rightSideStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };

const exitStyle = { marginLeft: 52 };

const avatarStyle = { marginLeft: 20, marginRight: 8 };

const titleStyle = {
    cursor: 'pointer',
};
