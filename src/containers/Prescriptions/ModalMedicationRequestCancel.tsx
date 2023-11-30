import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Medication, MedicationRequest } from 'fhir/r4b';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface ModalMedicationRequestCancelProps {
    medicationRequest: MedicationRequest;
    medication: Medication;
    onCreate: () => void;
}
export const ModalMedicationRequestCancel = (props: ModalMedicationRequestCancelProps) => {
    return (
        <ModalTrigger
            title={t`Cancel Medication Request`}
            trigger={
                <Button type="primary">
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
                            resource: props.medicationRequest,
                        },
                        {
                            name: 'Medication',
                            resource: props.medication,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Medication request successfully cancelled` });
                        props.onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
