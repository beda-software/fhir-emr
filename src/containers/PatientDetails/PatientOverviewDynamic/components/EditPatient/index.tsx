import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Patient } from 'fhir/r4b';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { usePatientReload } from 'src/containers/PatientDetails/Dashboard/contexts';
import s from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.module.scss';

interface Props {
    patient: Patient;
}

export function EditPatient({ patient }: Props) {
    const reload = usePatientReload();

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
