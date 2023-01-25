import { ContactsOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import _ from 'lodash';

import { Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { DashboardCard } from 'src/components/DashboardCard';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { formatHumanDate, getPersonAge } from 'src/utils/date';

import s from './PatientOverview.module.scss';

interface Props {
    patient: Patient;
    reload: () => void;
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

    return { details };
}

export function PatientOverview(props: Props) {
    const { details } = usePatientOverview(props);

    return (
        <div className={s.container}>
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
