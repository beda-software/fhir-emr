import { PractitionerRole } from 'fhir/r4b';

import { RenderRemoteData, formatFHIRDateTime } from '@beda.software/fhir-react';

import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';

interface Props {
    practitionerRole: PractitionerRole;
    appointmentId: string;
    onSubmit: () => void;
    onClose: () => void;
    showModal: boolean;
    start: Date;
}

export function EditAppointmentModal(props: Props) {
    const { showModal, onClose, appointmentId, practitionerRole, start } = props;

    const appointmentStartDateTime = formatFHIRDateTime(start);

    const { response, onSubmit } = useQuestionnaireResponseForm({
        questionnaireLoader: { type: 'id', questionnaireId: 'edit-appointment' },
        questionnaireResponseSaveService: inMemorySaveService,
        launchContextParameters: [
            {
                name: 'CurrentAppointment',
                resource: {
                    resourceType: 'Appointment',
                    id: appointmentId,
                    status: 'booked',
                    participant: [{ status: 'accepted' }],
                    start: appointmentStartDateTime,
                },
            },
            {
                name: 'practitionerRole',
                resource: practitionerRole,
            },
        ],
        onSuccess: props.onSubmit,
        onCancel: onClose,
    });

    return (
        <Modal open={showModal} title="Edit Appointment" footer={null} onCancel={onClose}>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(formData) => <BaseQuestionnaireResponseForm formData={formData} onSubmit={onSubmit} />}
            </RenderRemoteData>
        </Modal>
    );
}
