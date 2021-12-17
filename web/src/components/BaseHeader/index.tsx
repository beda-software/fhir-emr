import { Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import History from 'history';
import { Link, useHistory } from 'react-router-dom';
export interface RouteItem {
    path: string;
    exact?: boolean;
    title: string;
    icon?: React.ReactElement;
}

export function BaseHeader() {
    const menuItems: RouteItem[] = [
        { title: 'Patients', path: '/patients' },
        { title: 'Encounters', path: '/encounters' },
        { title: 'Practitioners', path: '/practitioners' },
        { title: 'Questionnaires', path: '/questionnaires' },
        { title: 'Example', path: '/example' },
    ];

    const history = useHistory();
    const menuDefaultSelectedKeys = getActiveKeys(history, menuItems).map(
        ({ path, title }) => path || title,
    );

    return (
        <Header style={headerStyle}>
         
            <Menu mode="horizontal" theme="light" selectedKeys={menuDefaultSelectedKeys}>
                {renderMenu(menuItems)}
            </Menu>
   
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
    // display: 'flex',
    // alignItems: 'center',
    // padding: '0 25px',
    // justifyContent: 'space-between',
    // height: '50px',
    // backgroundColor: 'green',
};

const titleStyle = {
    cursor: 'pointer',
};

const userStyle = {
    cursor: 'pointer',
};
