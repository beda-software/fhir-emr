import { t, Trans } from '@lingui/macro';
import { Menu, Button, notification, Row, Col } from 'antd';
import Title from 'antd/es/typography/Title';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageHeader } from 'src/components/BaseLayout';
import { RouteItem } from 'src/components/BaseLayout/Header';
import Breadcrumbs from 'src/components/Breadcrumbs';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

import { PatientHeaderContext } from './context';
import s from './PatientHeader.module.scss';

interface Props {
    patient: Patient;
    reload: () => void;
}

export function PatientHeaderContextProvider(
    props: React.HTMLAttributes<HTMLDivElement> & { patient: Patient },
) {
    const { children, patient } = props;
    const [pageTitle, setPageTitle] = useState(renderHumanName(patient.name?.[0]));
    const [showMenu, setShowMenu] = useState(false);

    return (
        <PatientHeaderContext.Provider
            value={{ title: pageTitle, setTitle: (v) => setPageTitle(v), showMenu,
                setShowMenu: (v) => setShowMenu(v) }}
        >
            {children}
        </PatientHeaderContext.Provider>
    );
}

export function PatientHeader(props: Props) {
    const { patient, reload } = props;
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const { title, setTitle, showMenu, setShowMenu } = useContext(PatientHeaderContext);

    const menuItems: RouteItem[] = useMemo(() => ([
        { title: t`Demographics`, path: `/patients/${params.id}` },
        { title: t`Encounters`, path: `/patients/${params.id}/encounters` },
        { title: t`Documents`, path: `/patients/${params.id}/documents` },
    ]), [params.id]);

    useEffect(() => {
        setTitle(renderHumanName(patient.name?.[0]));
    }, [setTitle, patient.name]);

    useEffect(() => {
        const paths = menuItems.map((i) => i.path);

        if (paths.includes(location.pathname)) {
            setShowMenu(true);
        } else {
            setShowMenu(false);
        }
    }, [setShowMenu, location.pathname, menuItems]);

    const [currentPath, setCurrentPath] = useState(location?.pathname);

    const phoneNumber =
        patient.telecom && patient.telecom.length > 0
            ? patient.telecom.filter(({ system }) => system === 'mobile')[0]!.value
            : undefined;

    const getCurrentPathName = () => {
        if (location?.pathname.indexOf('encounters') !== -1) {
            return t`Encounters`;
        }

        if (location?.pathname.indexOf('documents') !== -1) {
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

    useEffect(() => {
        setCurrentPath(location?.pathname);
    }, [location]);

    const renderMenu = () => {
        return (
            <Menu
                mode="horizontal"
                theme="light"
                selectedKeys={[currentPath.split('/').slice(0, 4).join('/')]}
                className={s.menu}
                items={menuItems.map((route) => ({
                    key: route.path,
                    label: <Link to={route.path}>{route.title}</Link>,
                }))}
            />
        );
    };

    return (
        <BasePageHeader style={{ paddingBottom: 0 }}>
            <Breadcrumbs crumbs={crumbs(patient)} />
            <Row justify="space-between" align="middle" style={{ marginBottom: 21 }}>
                <Col>
                    <Title style={{ marginBottom: 0 }}>{title}</Title>
                </Col>
                <Col
                    flex={1}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 16,
                    }}
                >
                    {patient.birthDate && <div>{patient.birthDate}</div>}
                    {phoneNumber && <div>+{phoneNumber}</div>}
                    <ModalTrigger
                        title={t`Edit patient`}
                        trigger={
                            <Button type="link">
                                <Trans>Edit</Trans>
                            </Button>
                        }
                    >
                        {({ closeModal }) => (
                            <QuestionnaireResponseForm
                                questionnaireLoader={questionnaireIdLoader('patient-edit')}
                                launchContextParameters={[{ name: 'Patient', resource: patient }]}
                                onSuccess={() => {
                                    notification.success({
                                        message: t`Patient saved`,
                                    });
                                    reload();
                                    closeModal();
                                }}
                            />
                        )}
                    </ModalTrigger>
                </Col>
            </Row>
            {showMenu && renderMenu()}
        </BasePageHeader>
    );
}
