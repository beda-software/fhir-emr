import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { PractitionerRole } from 'shared/src/contrib/aidbox';
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
}

export function EditAppointmentModal(props: Props) {
    const { showModal, onClose, appointmentId } = props;

    const { response, onSubmit } = useQuestionnaireResponseForm({
        questionnaireLoader: { type: 'id', questionnaireId: 'edit-appointment' },
        questionnaireResponseSaveService: inMemorySaveService,
        launchContextParameters: [
            { name: 'CurrentAppointmentId', value: { string: appointmentId } },
        ],
        onSuccess: props.onSubmit,
        onCancel: onClose,
    });

    return (
        <Modal open={showModal} title="Edit Appointment" footer={null} onCancel={onClose}>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(formData) => (
                    <BaseQuestionnaireResponseForm formData={formData} onSubmit={onSubmit} />
                )}
            </RenderRemoteData>
        </Modal>
    );
}
