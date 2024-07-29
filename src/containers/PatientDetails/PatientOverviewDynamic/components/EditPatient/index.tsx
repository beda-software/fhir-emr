import { t, Trans } from '@lingui/macro';
import { notification } from 'antd';
import { Patient } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { usePatientReload } from 'src/containers/PatientDetails/Dashboard/contexts';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

interface Props {
    patient: Patient;
}

export function EditPatient({ patient }: Props) {
    const reload = usePatientReload();

    return (
        <ModalTrigger
            title={t`Edit patient`}
            trigger={
                <S.EditButton type="link">
                    <Trans>Edit</Trans>
                </S.EditButton>
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
