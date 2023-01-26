import { ContactsOutlined, ExperimentOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import _ from 'lodash';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'aidbox-react/lib/services/service';

import { AllergyIntolerance, Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { DashboardCard, DashboardCardTable } from 'src/components/DashboardCard';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { formatHumanDate, getPersonAge } from 'src/utils/date';

import s from './PatientOverview.module.scss';

interface Props {
    patient: Patient;
    reload: () => void;
}

interface OverviewCard<T = any> {
    title: string;
    icon: React.ReactNode;
    data: T[];
    columns: {
        key: string;
        title: string;
        render: (r: T) => React.ReactNode;
        width?: string | number;
    }[];
    getKey: (r: T) => string;
}

function prepareAllergies(allergies: AllergyIntolerance[]): OverviewCard<AllergyIntolerance> {
    return {
        title: t`Allergies`,
        icon: <ExperimentOutlined />,
        data: allergies,
        getKey: (r: AllergyIntolerance) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (r: AllergyIntolerance) => r.code?.coding?.[0]?.display,
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: AllergyIntolerance) => formatHumanDate(r.meta?.createdAt!),
                width: 200,
            },
        ],
    };
}

function usePatientOverview(props: Props) {
    const { patient } = props;

    let details = [
        {
            title: 'Birth date',
            value: patient.birthDate
                ? `${formatHumanDate(patient.birthDate)} • ${getPersonAge(patient.birthDate)}`
                : undefined,
        },
        {
            title: 'Sex',
            value: _.upperFirst(patient.gender),
        },
        // TODO: calculate after Vitals added
        // {
        //     title: 'BMI',
        //     value: '26',
        // },
        {
            title: 'Phone number',
            value: patient.telecom?.filter(({ system }) => system === 'mobile')[0]!.value,
        },
        {
            title: 'SSN',
            value: undefined,
        },
    ];

    const [response] = useService(
        async () =>
            mapSuccess(
                await resolveMap({
                    allergiesBundle: getFHIRResources<AllergyIntolerance>('AllergyIntolerance', {
                        patient: patient.id,
                        _sort: ['-lastUpdated'],
                    }),
                }),
                ({ allergiesBundle }) => {
                    const allergies = extractBundleResources(allergiesBundle).AllergyIntolerance;
                    const cards = [prepareAllergies(allergies)];

                    return { cards: cards.filter((i) => i.data.length) };
                },
            ),
        [],
    );

    return { response, details };
}

export function PatientOverview(props: Props) {
    const { response, details } = usePatientOverview(props);

    return (
        <div className={s.container}>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {({ cards }) => (
                    <>
                        <DashboardCard
                            title={t`General Information`}
                            extra={<EditPatient {...props} />}
                            icon={<ContactsOutlined />}
                        >
                            <div className={s.detailsRow}>
                                {details.map(({ title, value }, index) => (
                                    <div key={`patient-details__${index}`} className={s.detailItem}>
                                        <div className={s.detailsTitle}>{title}</div>
                                        <div className={s.detailsValue}>{value || '-'}</div>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>
                        <div className={s.cards}>
                            {cards.map((card) => (
                                <DashboardCard
                                    title={card.title}
                                    icon={card.icon}
                                    key={`cards-${card.title}`}
                                    className={s.card}
                                >
                                    <DashboardCardTable
                                        title={card.title}
                                        data={card.data}
                                        columns={card.columns}
                                        getKey={card.getKey}
                                    />
                                </DashboardCard>
                            ))}
                        </div>
                    </>
                )}
            </RenderRemoteData>
        </div>
    );
}

function EditPatient(props: Props) {
    const { patient, reload } = props;

    return (
        <ModalTrigger
            title={t`Edit patient`}
            trigger={
                <Button type="link" className={s.editButton}>
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
    );
}
