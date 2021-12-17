import { Menu, PageHeader } from 'antd';
import { Button } from 'antd/lib/radio';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { renderMenu, RouteItem } from 'src/components/BaseHeader';
import { BaseLayout } from 'src/components/BaseLayout';
import Breadcrumbs from 'src/components/Breadcrumbs';
import { PatientGeneralInfo } from 'src/components/PatientGeneralInfo';

export const PatientDetails = () => {
    const location = useLocation();
    const params: { id: string } = useParams();

    const [currentPath, setCurrentPath] = useState(location.pathname);

    const menuItems: RouteItem[] = [
        { title: 'Общая информация', path: `/patients/${params.id}` },
        { title: 'Приемы', path: `/patients/${params.id}/encounters` },
        { title: 'Мед Карта', path: `/patients/${params.id}/documents` },
    ];

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
            path: '/patients',
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

    const getCurrentPathEnd = () => {
        const pathLength = location.pathname.split('/').length;
        return location.pathname.split('/')[pathLength - 1];
    };

    const currentPathEnd = getCurrentPathEnd();

    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location]);

    return (
        <BaseLayout bgHeight={194}>
            <PageHeader
                title={params.id}
                extra={[
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: 37}}>31.12.1954</div>
                        <div style={{marginRight: 37}}>123-123-123 09</div>
                        <Button>Редактировать</Button>
                    </div>,
                ]}
                breadcrumb={<Breadcrumbs crumbs={crumbs} />}
            />
            <Menu
                mode="horizontal"
                theme="light"
                selectedKeys={[currentPath]}
                style={{ width: 400 }}
            >
                {renderMenu(menuItems)}
            </Menu>
            {currentPathEnd === 'encounters' ? (
                <div>encounters</div>
            ) : currentPathEnd === 'documents' ? (
                <div>documents</div>
            ) : (
                <PatientGeneralInfo generalInfo={generalInfo} />
            )}
        </BaseLayout>
    );
};
