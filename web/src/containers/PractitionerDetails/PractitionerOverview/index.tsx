import { ContactsOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { WithId } from 'fhir-react/lib/services/fhir';
import { Practitioner, PractitionerRole } from 'fhir/r4b';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { DashboardCard } from 'src/components/DashboardCard';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

import s from './PractitionerOverview.module.scss';

interface Props {
    practitioner: WithId<Practitioner>;
    practitionerRole?: WithId<PractitionerRole>;
    reload: () => void;
}

function usePractitionerOverview(props: Props) {
    const { practitioner, practitionerRole } = props;

    let details = [
        {
            title: 'First name',
            value: practitioner.name?.[0]?.given?.[0],
        },
        {
            title: 'Last name',
            value: practitioner.name?.[0]?.family,
        },
        {
            title: 'Middle name',
            value: practitioner.name?.[0]?.given?.[1],
        },
        {
            title: 'Specialty',
            value: practitionerRole?.specialty?.[0]?.coding?.[0]?.display,
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
                        <div key={`practitioner-details__${index}`} className={s.detailItem}>
                            <div className={s.detailsTitle}>{title}</div>
                            <div className={s.detailsValue}>{value}</div>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        </div>
    );
}
