import { Button, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import History from 'history';
import { Link, useHistory } from 'react-router-dom';

import { AvatarImage } from 'src/images/AvatarImage';
import { LogoImage } from 'src/images/LogoImage';

export interface RouteItem {
    path: string;
    exact?: boolean;
    title: string;
    icon?: React.ReactElement;
}

export function BaseHeader() {
    const menuItems: RouteItem[] = [
        { title: 'Приемы', path: '/encounters' },
        { title: 'Пациенты', path: '/patients' },
        { title: 'Врачи', path: '/practitioners' },
        { title: 'Опросники', path: '/questionnaires' },
        { title: 'Example', path: '/example' },
    ];

    const history = useHistory();
    const menuDefaultSelectedKeys = getActiveKeys(history, menuItems).map(
        ({ path, title }) => path || title,
    );

    return (
        <Header style={headerStyle}>
            <LogoImage style={titleStyle} />
            <div style={rightSideStyle}>
                <Menu mode="horizontal" theme="light" selectedKeys={menuDefaultSelectedKeys}>
                    {renderMenu(menuItems)}
                </Menu>
                <Button onClick={() => console.log('exit')} style={exitStyle}>
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

function renderMenu(menuRoutes: RouteItem[]) {
    return menuRoutes.map((route) => {
        return (
            <Menu.Item key={route.path}>
                <Link to={route.path}>{renderMenuTitle(route)}</Link>
            </Menu.Item>
        );
    });
}

function getActiveKeys(history: History.History, menuRoutes: RouteItem[]): RouteItem[] {
    return menuRoutes.filter(({ path }) => {
        if (path) {
            return (
                history.location.pathname === path ||
                history.location.pathname.startsWith(`${path}/`)
            );
        }

        return false;
    });
}

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100vw',
    height: '64px',
    backgroundColor: '#ffffff',
};

const rightSideStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };

const exitStyle = { marginLeft: 52 };

const avatarStyle = { marginLeft: 20, marginRight: 8 };

const titleStyle = {
    cursor: 'pointer',
};
