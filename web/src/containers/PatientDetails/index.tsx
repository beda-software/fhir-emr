import { Menu, PageHeader } from 'antd';
import { Button } from 'antd/lib/radio';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { renderMenu, RouteItem } from 'src/components/BaseHeader';
import { BaseLayout } from 'src/components/BaseLayout';
import Breadcrumbs from 'src/components/Breadcrumbs';
import { PatientGeneralInfo } from 'src/components/PatientGeneralInfo';

export const PatientDetails = () => {
    const location = useLocation<any>();
    const params: { id: string } = useParams();

    const [currentPath, setCurrentPath] = useState(location.pathname);

    const [patientResponse] = useService(
        async () => await getFHIRResource<Patient>({ resourceType: 'Patient', id: params.id }),
    );

    const menuItems: RouteItem[] = [
        { title: 'Общая информация', path: `/patients/${params.id}` },
        { title: 'Приемы', path: `/patients/${params.id}/encounters` },
        { title: 'Мед Карта', path: `/patients/${params.id}/documents` },
    ];

    const generalInfo = (patient: Patient) => [
        [
            { title: 'Дата рождения', value: patient.birthDate },
            {
                title: 'СНИЛС',
                value:
                    patient.identifier?.[0].system === 'snils'
                        ? patient.identifier?.[0].value
                        : 'Снилс отсутсвует',
            },
            { title: 'Паспортные данные', value: 'Паспортные данные' },
        ],
        [{ title: 'Мобильный телефон', value: patient.telecom?.[0].value }],
        [
            { title: 'Дата рождения', value: patient.birthDate },
            { title: 'Пол', value: patient.gender },
        ],
    ];

    const getCurrentPathName = () => {
        if (currentPathEnd === 'encounters') {
            return 'Приемы';
        }

        if (currentPathEnd === 'documents') {
            return 'Документы';
        }

        return 'Общая информация';
    };

    const crumbs = (patient: Patient) => [
        {
            path: '/patients',
            name: 'Пациенты',
        },
        {
            path: `/patients/${params.id}`,
            name: renderHumanName(patient.name?.[0]),
        },
        {
            path: `/patients/${params.id}`,
            name: getCurrentPathName(),
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
        <RenderRemoteData remoteData={patientResponse}>
            {(patient) => (
                <BaseLayout bgHeight={194}>
                    <PageHeader
                        title={renderHumanName(patient.name?.[0])}
                        extra={[
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ marginRight: 37 }}>31.12.1954</div>
                                <div style={{ marginRight: 37 }}>123-123-123 09</div>
                                <Button>Редактировать</Button>
                            </div>,
                        ]}
                        breadcrumb={<Breadcrumbs crumbs={crumbs(patient)} />}
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
                        <PatientGeneralInfo generalInfo={generalInfo(patient)} />
                    )}
                </BaseLayout>
            )}
        </RenderRemoteData>
    );
};
