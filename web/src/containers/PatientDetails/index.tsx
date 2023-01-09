import { t, Trans } from '@lingui/macro';
import { Menu, PageHeader, Button, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout, BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import Breadcrumbs from 'src/components/Breadcrumbs';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { PatientGeneralInfo } from 'src/components/PatientGeneralInfo';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { RouteItem } from 'src/components/BaseLayout/Header';

import s from './PatientDetails.module.scss';
import { PatientDocuments } from './PatientDocuments';

export const PatientDetails = () => {
    const location = useLocation();
    const params = useParams<{ id: string }>();

    const [currentPath, setCurrentPath] = useState(location?.pathname);

    const [patientResponse, manager] = useService(
        async () => await getFHIRResource<Patient>({ resourceType: 'Patient', id: params.id! }),
    );

    const menuItems: RouteItem[] = [
        { title: t`Demographics`, path: `/patients/${params.id}` },
        { title: t`Encounters`, path: `/patients/${params.id}/encounters` },
        { title: t`Documents`, path: `/patients/${params.id}/documents` },
    ];

    const getGeneralInfo = (patient: Patient) => [
        [
            { title: t`Birth date`, value: patient.birthDate },
            {
                title: t`SSN`,
                value:
                    patient.identifier?.[0].system === '1.2.643.100.3'
                        ? patient.identifier?.[0].value
                        : t`Missing`,
            },
            { title: t`Passport data`, value: t`Missing` },
        ],
        [{ title: t`Phone number`, value: patient.telecom?.[0].value }],
        [
            {
                title: t`Sex`,
                value:
                    patient.gender == 'male'
                        ? t`Male`
                        : patient.gender === 'female'
                        ? t`Female`
                        : t`Missing`,
            },
        ],
    ];

    const getCurrentPathName = () => {
        if (currentPathEnd === 'encounters') {
            return t`Encounters`;
        }

        if (currentPathEnd === 'documents') {
            return t`Documents`;
        }

        return t`General information`;
    };

    const crumbs = (patient: Patient) => [
        {
            path: '/patients',
            name: t`Patients`,
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
        const pathLength = location?.pathname.split('/').length;
        return location?.pathname.split('/')[pathLength - 1];
    };

    const currentPathEnd = getCurrentPathEnd();

    useEffect(() => {
        setCurrentPath(location?.pathname);
    }, [location]);

    const renderMenu = () => {
        return (
            <Menu mode="horizontal" theme="light" selectedKeys={[currentPath]} className={s.menu}>
                {menuItems.map((route) => (
                    <Menu.Item key={route.path}>
                        <Link to={route.path}>{route.title}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        );
    };

    return (
        <RenderRemoteData remoteData={patientResponse}>
            {(patient) => {
                const generalInfo = getGeneralInfo(patient);
                return (
                    <BaseLayout>
                        <BasePageHeader>
                            <PageHeader
                                title={renderHumanName(patient.name?.[0])}
                                extra={[
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ marginRight: 37 }}>{patient.birthDate}</div>
                                        <div style={{ marginRight: 37 }}>
                                            {patient.identifier?.[0]?.value}
                                        </div>
                                        <ModalTrigger
                                            title={t`Edit patient`}
                                            trigger={
                                                <Button type="link" block>
                                                    <Trans>Edit</Trans>
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
                                                            message: t`Patient saved`,
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
                            {renderMenu()}
                        </BasePageHeader>
                        <BasePageContent>
                            {currentPathEnd === 'encounters' ? (
                                <PatientEncounter patient={patient} />
                            ) : currentPathEnd === 'documents' ? (
                                <PatientDocuments patient={patient} />
                            ) : (
                                <PatientGeneralInfo generalInfo={generalInfo} />
                            )}
                        </BasePageContent>
                    </BaseLayout>
                );
            }}
        </RenderRemoteData>
    );
};
