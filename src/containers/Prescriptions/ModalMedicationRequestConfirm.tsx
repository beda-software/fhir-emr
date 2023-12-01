import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { MedicationRequest } from 'fhir/r4b';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface ModalMedicationRequestConfirmProps {
    medicationRequest: MedicationRequest;
    onCreate: () => void;
}
export const ModalMedicationRequestConfirm = (props: ModalMedicationRequestConfirmProps) => {
    return (
        <ModalTrigger
            title={t`Confirm Medication Request`}
            trigger={
                <Button type="primary" disabled={props.medicationRequest.status !== 'active'}>
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
                            resource: props.medicationRequest,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Medication request successfully confirmed` });
                        props.onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
