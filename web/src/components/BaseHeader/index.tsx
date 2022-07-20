import { t, Trans } from '@lingui/macro';
import { Button, Menu, Radio } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import History from 'history';
import _ from 'lodash';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

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
            {Object.entries(locales).map(([value, label]) => (
                <Radio.Button value={value}>{label}</Radio.Button>
            ))}
        </Radio.Group>
    );
}

export function BaseHeader() {
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

    const navigate = useNavigate();
    const menuDefaultSelectedKeys = getActiveKeys(navigate, menuItems).map(
        ({ path, title }) => path || title,
    );

    return (
        <Header style={headerStyle}>
            <LogoImage style={titleStyle} />
            <div style={rightSideStyle}>
                <Menu
                    mode="horizontal"
                    theme="light"
                    selectedKeys={menuDefaultSelectedKeys}
                    style={{ width: 400 }}
                >
                    {renderMenu(menuItems)}
                </Menu>
                <Button onClick={doLogout} style={exitStyle}>
                    <Trans>Log out</Trans>
                </Button>
                <AvatarImage style={avatarStyle} />

                <span style={titleStyle}>{renderHumanName()}</span>
                <LocaleSwitcher />
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
    return menuRoutes.map((route) => {
        return (
            <Menu.Item key={route.path}>
                <Link to={route.path}>{renderMenuTitle(route)}</Link>
            </Menu.Item>
        );
    });
}

function getActiveKeys(navigate: NavigateFunction, menuRoutes: RouteItem[]): RouteItem[] {
    return menuRoutes.filter(({ path }) => {
        if (path) {
            return navigate;
        }

        return false;
    });
}

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 1080,
    height: '64px',
    backgroundColor: '#ffffff',
    padding: 0,
};

const rightSideStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };

const exitStyle = { marginLeft: 52 };

const avatarStyle = { marginLeft: 20, marginRight: 8 };

const titleStyle = {
    cursor: 'pointer',
};
