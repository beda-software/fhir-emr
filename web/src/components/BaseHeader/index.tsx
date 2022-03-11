import { Button, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { Link, Location, useLocation } from 'react-router-dom';

import { resetInstanceToken } from 'aidbox-react/lib/services/instance';

import { AvatarImage } from 'src/images/AvatarImage';
import { LogoImage } from 'src/images/LogoImage';
import { logout } from 'src/services/auth';

export interface RouteItem {
    path: string;
    exact?: boolean;
    title: string;
    icon?: React.ReactElement;
}

export function BaseHeader() {
    const doLogout = async () => {
        await logout();
        resetInstanceToken();
        localStorage.clear();
        window.location.href = '/';
    };

    const menuItems: RouteItem[] = [
        { title: 'Приемы', path: '/encounters' },
        { title: 'Пациенты', path: '/patients' },
        { title: 'Врачи', path: '/practitioners' },
        { title: 'Опросники', path: '/questionnaires' },
    ];

    const location = useLocation();

    const menuDefaultSelectedKeys = getActiveKeys(location, menuItems).map(
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
                    Выйти
                </Button>
                <AvatarImage style={avatarStyle} />
                <span style={titleStyle}>Бурда Борис</span>
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

function getActiveKeys(location: Location, menuRoutes: RouteItem[]): RouteItem[] {
    return menuRoutes.filter(({ path }) => {
        if (path) {
            return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
