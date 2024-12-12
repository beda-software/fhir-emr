import { ContactsOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { DashboardCard } from 'src/components/DashboardCard';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import s from './PractitionerOverview.module.scss';
import { S } from './PractitionerOverview.styles';

interface Props {
    practitioner: WithId<Practitioner>;
    practitionerRole?: WithId<PractitionerRole>;
    healthcareServices?: WithId<HealthcareService>[];
    reload: () => void;
}

function usePractitionerOverview(props: Props) {
    const { practitioner, practitionerRole, healthcareServices } = props;

    const details = [
        {
            title: t`First name`,
            value: practitioner.name?.[0]?.given?.[0],
        },
        {
            title: t`Last name`,
            value: practitioner.name?.[0]?.family,
        },
        {
            title: t`Middle name`,
            value: practitioner.name?.[0]?.given?.[1],
        },
        {
            title: t`Specialty`,
            value: practitionerRole?.specialty?.[0]?.coding?.[0]?.display,
        },
        {
            title: t`Available services`,
            value:
                healthcareServices?.map((hs) => hs.name).join(', ') ||
                practitionerRole?.healthcareService?.map((hs) => hs.display).join(', '),
        },
    ];

    return { details };
}

export function PractitionerOverview(props: Props) {
    const { practitioner, practitionerRole, reload } = props;
    const { details } = usePractitionerOverview(props);

    return (
        <div className={s.container}>
            <DashboardCard
                title={t`General Information`}
                extra={
                    <ModalTrigger
                        title={t`Edit practitioner data`}
                        trigger={
                            <Button type="link" className={s.editButton}>
                                <Trans>Edit</Trans>
                            </Button>
                        }
                    >
                        {({ closeModal }) => (
                            <QuestionnaireResponseForm
                                questionnaireLoader={questionnaireIdLoader('practitioner-edit')}
                                launchContextParameters={[
                                    {
                                        name: 'Practitioner',
                                        resource: practitioner,
                                    },
                                    ...(practitionerRole
                                        ? [
                                              {
                                                  name: 'PractitionerRole',
                                                  resource: practitionerRole,
                                              },
                                          ]
                                        : []),
                                ]}
                                onSuccess={() => {
                                    reload();
                                    closeModal();
                                    notification.success({
                                        message: t`Clinician successfully updated`,
                                    });
                                }}
                                onCancel={closeModal}
                            />
                        )}
                    </ModalTrigger>
                }
                icon={<ContactsOutlined />}
                className={s.card}
            >
                <div className={s.details}>
                    {details.map(({ title, value }, index) => (
                        <S.DetailsItem key={`practitioner-details__${index}`}>
                            <S.DetailsTitle>{title}</S.DetailsTitle>
                            <S.DetailsValue>{value}</S.DetailsValue>
                        </S.DetailsItem>
                    ))}
                </div>
            </DashboardCard>
        </div>
    );
}
