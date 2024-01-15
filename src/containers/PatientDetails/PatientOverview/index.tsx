import { CalendarOutlined, ContactsOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Appointment, Bundle, Patient } from 'fhir/r4b';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';

import { extractBundleResources, RenderRemoteData, WithId } from '@beda.software/fhir-react';
import { isLoading, isSuccess } from '@beda.software/remote-data';

import { Encounter } from 'shared/src/contrib/aidbox';
import { inMemorySaveService, questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { DashboardCard, DashboardCardTable } from 'src/components/DashboardCard';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm, useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { useNavigateToEncounter } from 'src/containers/EncounterDetails/hooks';

import { usePatientOverview } from './hooks';
import s from './PatientOverview.module.scss';
import { S } from './PatientOverview.styles';
import { OverviewCard, prepareAppointmentDetails } from './utils';

export interface PatientOverviewProps {
    patient: Patient;
    reload: () => void;
}

export function PatientOverview(props: PatientOverviewProps) {
    const { response, patientDetails } = usePatientOverview(props);
    const location = useLocation();

    const renderAppointmentCards = (appointments: Appointment[]) => {
        return appointments.map((appointment) => {
            const appointmentDetails = prepareAppointmentDetails(appointment);

            return (
                <DashboardCard
                    key={`card-appointment-${appointment.id}`}
                    title={t`Upcoming appointment`}
                    extra={<StartEncounter appointmentId={appointment.id!} />}
                    icon={<CalendarOutlined />}
                >
                    <div className={s.detailsRow}>
                        {appointmentDetails.map(({ title, value }, index) => (
                            <div key={`patient-details__${index}`} className={s.detailItem}>
                                <S.DetailsTitle>{title}</S.DetailsTitle>
                                <div className={s.detailsValue}>{value || '-'}</div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
            );
        });
    };

    const renderCards = (cards: OverviewCard[]) => {
        return cards.map((card) => (
            <DashboardCard
                title={card.title}
                icon={card.icon}
                key={`cards-${card.key}`}
                empty={!card.data.length}
                extra={
                    card.total && card.total > 7 ? (
                        <Link to={`${location.pathname}/resources/${card.key}`}>
                            <b>
                                <Trans>See all</Trans>
                                {` (${card.total})`}
                            </b>
                        </Link>
                    ) : null
                }
            >
                <DashboardCardTable title={card.title} data={card.data} columns={card.columns} getKey={card.getKey} />
            </DashboardCard>
        ));
    };

    return (
        <div className={s.container}>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {({ cards, appointments }) => {
                    const leftColCards = _.filter(
                        cards,
                        (c: OverviewCard, index: number) => index % 2 === 0,
                    ) as OverviewCard[];
                    const rightColCards = _.filter(
                        cards,
                        (c: OverviewCard, index: number) => index % 2 !== 0,
                    ) as OverviewCard[];

                    return (
                        <>
                            {renderAppointmentCards(appointments)}
                            <DashboardCard
                                title={t`General Information`}
                                extra={<EditPatient {...props} />}
                                icon={<ContactsOutlined />}
                            >
                                <div className={s.detailsRow}>
                                    {patientDetails.map(({ title, value }, index) => (
                                        <div key={`patient-details__${index}`} className={s.detailItem}>
                                            <S.DetailsTitle>{title}</S.DetailsTitle>
                                            <div className={s.detailsValue}>{value || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardCard>
                            <div className={s.cards}>
                                <div className={s.column}>{renderCards(leftColCards)}</div>
                                <div className={s.column}>{renderCards(rightColCards)}</div>
                            </div>
                        </>
                    );
                }}
            </RenderRemoteData>
        </div>
    );
}

function EditPatient(props: PatientOverviewProps) {
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

interface StartEncounterProps {
    appointmentId: string;
    onClose?: () => void;
}

export function useStartEncounter(props: StartEncounterProps) {
    const { appointmentId } = props;
    const { navigateToEncounter } = useNavigateToEncounter();

    const { response, onSubmit } = useQuestionnaireResponseForm({
        questionnaireLoader: { type: 'id', questionnaireId: 'encounter-create-from-appointment' },
        questionnaireResponseSaveService: inMemorySaveService,
        launchContextParameters: [
            {
                name: 'Appointment',
                resource: {
                    resourceType: 'Appointment',
                    id: appointmentId,
                    status: 'booked',
                    participant: [{ status: 'accepted' }],
                },
            },
        ],
        onSuccess: ({ extractedBundle }: { extractedBundle: Bundle<WithId<Encounter>>[] }) => {
            // NOTE: mapper extract resources in FCE format
            const encounter = extractBundleResources(extractedBundle[0]!).Encounter[0]!;
            const patientId = encounter.subject!.id;
            navigateToEncounter(patientId, encounter.id);
            if (props.onClose) {
                props.onClose();
            }
        },
    });

    return { response, onSubmit };
}

function StartEncounter(props: StartEncounterProps) {
    const { response, onSubmit } = useStartEncounter(props);

    return (
        <Button
            key="start-the-encounter"
            onClick={() => {
                if (isSuccess(response)) {
                    onSubmit(response.data);
                }
            }}
            type="primary"
            loading={isLoading(response)}
            disabled={isLoading(response)}
        >
            <Trans>Start the encounter</Trans>
        </Button>
    );
}
