import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Medication, MedicationRequest } from 'fhir/r4b';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

interface ModalMedicationRequestCancelProps {
    medicationRequest: MedicationRequest;
    medication?: Medication;
    onCreate: () => void;
}
export const ModalMedicationRequestCancel = (props: ModalMedicationRequestCancelProps) => {
    const { medicationRequest, medication, onCreate } = props;
    return (
        <ModalTrigger
            title={t`Cancel Medication Request`}
            trigger={
                <Button type="default" disabled={medicationRequest.status !== 'active' || !medication}>
                    <span>
                        <Trans>Cancel</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('medication-request-cancel')}
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
                        notification.success({ message: t`Medication request successfully cancelled` });
                        onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
