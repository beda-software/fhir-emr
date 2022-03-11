import { Menu, PageHeader, Button, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { renderMenu, RouteItem } from 'src/components/BaseHeader';
import { BaseLayout } from 'src/components/BaseLayout';
import Breadcrumbs from 'src/components/Breadcrumbs';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { PatientGeneralInfo } from 'src/components/PatientGeneralInfo';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

export const PatientDetails = () => {
    const location = useLocation();
    const { id } = useParams();

    if (!id) {
        console.error('id is undefined');
        return <div>id is undefined</div>;
    }

    const [currentPath, setCurrentPath] = useState(location.pathname);

    const [patientResponse, manager] = useService(
        async () => await getFHIRResource<Patient>({ resourceType: 'Patient', id: id }),
    );

    const menuItems: RouteItem[] = [
        { title: 'Общая информация', path: `/patients/${id}` },
        { title: 'Приемы', path: `/patients/${id}/encounters` },
        { title: 'Мед Карта', path: `/patients/${id}/documents` },
    ];

    const getGeneralInfo = (patient: Patient) => [
        [
            { title: 'Дата рождения', value: patient.birthDate },
            {
                title: 'СНИЛС',
                value:
                    patient.identifier?.[0].system === '1.2.643.100.3'
                        ? patient.identifier?.[0].value
                        : 'Отсутсвует',
            },
            { title: 'Паспортные данные', value: 'Отсутствуют' },
        ],
        [{ title: 'Мобильный телефон', value: patient.telecom?.[0].value }],
        [
            {
                title: 'Пол',
                value:
                    patient.gender == 'male'
                        ? 'Мужской'
                        : patient.gender === 'female'
                        ? 'Женский'
                        : 'Отсутсвует',
            },
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
            path: `/patients/${id}`,
            name: renderHumanName(patient.name?.[0]),
        },
        {
            path: `/patients/${id}`,
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
            {(patient) => {
                const generalInfo = getGeneralInfo(patient);
                return (
                    <BaseLayout bgHeight={194}>
                        <PageHeader
                            title={renderHumanName(patient.name?.[0])}
                            extra={[
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: 37 }}>{patient.birthDate}</div>
                                    <div style={{ marginRight: 37 }}>
                                        {patient.identifier?.[0]?.value}
                                    </div>
                                    <ModalTrigger
                                        title="Редактирование пациента"
                                        trigger={
                                            <Button type="link" block>
                                                Редактировать
                                            </Button>
                                        }
                                    >
                                        {({ closeModal }) => (
                                            <QuestionnaireResponseForm
                                                questionnaireLoader={questionnaireIdLoader(
                                                    'patient-edit',
                                                )}
                                                launchContextParameters={[
                                                    { name: 'Patient', resource: patient },
                                                ]}
                                                onSuccess={() => {
                                                    notification.success({
                                                        message: 'Пациент сохранен',
                                                    });
                                                    manager.reload();
                                                    closeModal();
                                                }}
                                            />
                                        )}
                                    </ModalTrigger>
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
                            <PatientEncounter patientId={id} />
                        ) : currentPathEnd === 'documents' ? (
                            <div>documents</div>
                        ) : (
                            <PatientGeneralInfo generalInfo={generalInfo} />
                        )}
                    </BaseLayout>
                );
            }}
        </RenderRemoteData>
    );
};
