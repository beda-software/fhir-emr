import { t } from '@lingui/macro';
import { PractitionerRole } from 'fhir/r4b';

import { inMemorySaveService } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';

import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface Props {
    practitionerRole: PractitionerRole;
    appointmentId: string;
    onSubmit: () => void;
    onClose: () => void;
    showModal: boolean;
}

export function EditAppointmentModal(props: Props) {
    const { showModal, onClose, appointmentId, practitionerRole } = props;

    return (
        <Modal open={showModal} title={t`Edit Appointment`} footer={null} onCancel={onClose}>
            <QuestionnaireResponseForm
                questionnaireLoader={{ type: 'id', questionnaireId: 'edit-appointment' }}
                questionnaireResponseSaveService={inMemorySaveService}
                launchContextParameters={[
                    {
                        name: 'CurrentAppointment',
                        resource: {
                            resourceType: 'Appointment',
                            id: appointmentId,
                            status: 'booked',
                            participant: [{ status: 'accepted' }],
                        },
                    },
                    {
                        name: 'practitionerRole',
                        resource: practitionerRole,
                    },
                ]}
                onSuccess={props.onSubmit}
            />
        </Modal>
    );
}
