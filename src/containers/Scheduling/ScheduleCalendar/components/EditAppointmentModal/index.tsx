import { t } from '@lingui/macro';
import { PractitionerRole } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { inMemorySaveService } from 'src/hooks/questionnaire-response-form-data';

interface Props {
    practitionerRole: PractitionerRole;
    appointmentId: string;
    onSubmit: () => void;
    onClose: () => void;
    showModal: boolean;
}

export function EditAppointmentModal(props: Props) {
    const { showModal, onClose, appointmentId, practitionerRole } = props;

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
        <Modal open={showModal} title={t`Edit Appointment`} footer={null} onCancel={onClose}>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(formData) => <BaseQuestionnaireResponseForm formData={formData} onSubmit={onSubmit} />}
            </RenderRemoteData>
        </Modal>
    );
}
