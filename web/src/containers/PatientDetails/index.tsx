import { Menu, PageHeader } from 'antd';
import { Button } from 'antd/lib/radio';
import History from 'history';
import { useHistory } from 'react-router-dom';

import { renderMenu, RouteItem } from 'src/components/BaseHeader';
import { BaseLayout } from 'src/components/BaseLayout';
import Breadcrumbs from 'src/components/Breadcrumbs';
import { PatientGeneralInfo } from 'src/components/PatientGeneralInfo';

export const PatientDetails = () => {
    const menuItems: RouteItem[] = [
        { title: 'Общая информация', path: '/patients/:id' },
        { title: 'Приемы', path: '/patients/:id/encounters' },
        { title: 'Мед Карта', path: '/patients/:id/documents' },
    ];

    const history = useHistory();

    const menuDefaultSelectedKeys = getActiveKeys(history, menuItems).map(
        ({ path, title }) => path || title,
    );

    const generalInfo = [
        [
            { title: 'Дата рождения', value: '31.12.1954' },
            { title: 'СНИЛС', value: '123-123-123 09' },
            { title: 'Мобильный телефон', value: '+79112223344' },
        ],
        [
            { title: 'СНИЛС', value: '123-123-123 09' },
            { title: 'Паспортные данные', value: 'Паспортные данные' },
            { title: 'СНИЛС', value: '123-123-123 09' },
        ],
    ];

    const crumbs = [
        {
            path: '/',
            name: 'Пациенты',
        },
        {
            path: '/patients/тут-будет-айди',
            name: 'Друзь Александр',
        },
        {
            path: '/patients/тут-будет-айди',
            name: 'Общая информация',
        },
    ];

    return (
        <BaseLayout bgHeight={194}>
            <PageHeader
                title="Пациенты"
                extra={[
                    <span>31.12.1954</span>,
                    <span>123-123-123 09</span>,
                    <Button>Редактировать</Button>,
                ]}
                breadcrumb={<Breadcrumbs crumbs={crumbs} />}
            />
            <Menu
                mode="horizontal"
                theme="light"
                selectedKeys={menuDefaultSelectedKeys}
                style={{ width: 400 }}
            >
                {renderMenu(menuItems)}
            </Menu>
            <PatientGeneralInfo generalInfo={generalInfo} />
        </BaseLayout>
    );
};

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
