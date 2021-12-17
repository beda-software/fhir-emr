import { Menu, PageHeader } from 'antd';
import { Button } from 'antd/lib/radio';
import History from 'history';
import { useHistory } from 'react-router-dom';

import { renderMenu, RouteItem } from 'src/components/BaseHeader';
import { BaseLayout } from 'src/components/BaseLayout';

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

    return (
        <BaseLayout bgHeight={194}>
            <PageHeader
                title="Пациенты"
                extra={[
                    <span>31.12.1954</span>,
                    <span>123-123-123 09</span>,
                    <Button>Редактировать</Button>,
                ]}
            />
            <Menu
                mode="horizontal"
                theme="light"
                selectedKeys={menuDefaultSelectedKeys}
                style={{ width: 400 }}
            >
                {renderMenu(menuItems)}
            </Menu>
            <div style={infoContainerStyle}>
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-around',
                    }}
                >
                    {generalInfo.map((el, index) => {
                        return (
                            <div>
                                {generalInfo[index].map((el, index) => {
                                    return (
                                        <div key={index} style={{ marginBottom: 16 }}>
                                            <h3>{el.title}</h3>
                                            <div>{el.value}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
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

const infoContainerStyle = {
    width: 1080,
    backgroundColor: '#ffffff',
    padding: '32px 40px',
    boxShadow: '0px 6px 16px #E6EBF5',
    marginTop: 54,
};
