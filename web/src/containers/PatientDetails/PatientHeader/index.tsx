import { t, Trans } from '@lingui/macro';
import { Menu, Button, notification, Row, Col } from 'antd';
import Title from 'antd/es/typography/Title';
import _ from 'lodash';
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

import { BreadCrumb, PatientHeaderContext } from './context';
import s from './PatientHeader.module.scss';

interface Props {
    patient: Patient;
    reload: () => void;
}

export function PatientHeaderContextProvider(
    props: React.HTMLAttributes<HTMLDivElement> & { patient: Patient },
) {
    const { children, patient } = props;
    const [pageTitle] = useState(renderHumanName(patient.name?.[0]));
    const params = useParams<{ id: string }>();
    const location = useLocation();
    const rootPath = useMemo(() => `/patients/${params.id}`, [params.id]);

    const [breadcrumbsMap, setBreadcrumbs] = useState({
        '/patients': t`Patients`,
        [rootPath]: renderHumanName(patient.name?.[0]),
    });

    const breadcrumbs: BreadCrumb[] = useMemo(() => {
        const isRoot = rootPath === location?.pathname;
        const paths = _.toPairs(breadcrumbsMap);

        const result = _.chain(paths)
            .map(([path, name]) => (location?.pathname.includes(path) ? [path, name] : undefined))
            .compact()
            .sortBy(([path]) => path)
            .map(([path, name]) => ({ path, name }))
            .value() as BreadCrumb[];

        return isRoot ? [...result, {name: 'Overview'}] : result;
    }, [location?.pathname, breadcrumbsMap, rootPath]);

    return (
        <PatientHeaderContext.Provider
            value={{
                title: pageTitle,
                breadcrumbs,
                setBreadcrumbs: (newPath) => {
                    const pathNames = breadcrumbs.map((b) => b.name);
                    const newPathName = _.toPairs(newPath)[0]?.[1];
                    if (newPathName && pathNames.includes(newPathName)) {
                        return;
                    }

                    setBreadcrumbs((prevValue) => ({
                        ...prevValue,
                        ...newPath,
                    }));
                },
            }}
        >
            {children}
        </PatientHeaderContext.Provider>
    );
}

export function PatientHeader(props: Props) {
    const { patient, reload } = props;
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const { title, breadcrumbs } = useContext(PatientHeaderContext);

    const menuItems: RouteItem[] = useMemo(
        () => [
            { title: t`Overview`, path: `/patients/${params.id}` },
            { title: t`Encounters`, path: `/patients/${params.id}/encounters` },
            { title: t`Documents`, path: `/patients/${params.id}/documents` },
        ],
        [params.id],
    );

    const [currentPath, setCurrentPath] = useState(location?.pathname);

    const phoneNumber =
        patient.telecom && patient.telecom.length > 0
            ? patient.telecom.filter(({ system }) => system === 'mobile')[0]!.value
            : undefined;

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
            <Breadcrumbs crumbs={breadcrumbs} />
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
                                onCancel={closeModal}
                            />
                        )}
                    </ModalTrigger>
                </Col>
            </Row>
            {renderMenu()}
        </BasePageHeader>
    );
}
