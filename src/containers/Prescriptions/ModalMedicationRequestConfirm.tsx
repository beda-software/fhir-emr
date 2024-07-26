import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Medication, MedicationRequest } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

interface ModalMedicationRequestConfirmProps {
    medicationRequest: MedicationRequest;
    medication?: Medication;
    onCreate: () => void;
}
export const ModalMedicationRequestConfirm = (props: ModalMedicationRequestConfirmProps) => {
    const { medicationRequest, medication, onCreate } = props;
    return (
        <ModalTrigger
            title={t`Confirm Medication Request`}
            trigger={
                <Button type="primary" disabled={medicationRequest.status !== 'active' || !medication}>
                    <span>
                        <Trans>Confirm</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('medication-request-confirm')}
                    launchContextParameters={[
                        {
                            name: 'MedicationRequest',
                            resource: medicationRequest,
                        },
                        {
                            name: 'Medication',
                            resource: medication,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Medication request successfully confirmed` });
                        onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
