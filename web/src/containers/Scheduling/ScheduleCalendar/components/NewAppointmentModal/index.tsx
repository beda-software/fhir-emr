import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { PractitionerRole } from 'fhir/r4b';

import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';
import { formatFHIRDateTime } from 'shared/src/utils/date';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';

interface NewAppointmentModalProps {
    practitionerRole: PractitionerRole;
    start: Date;
    end: Date;
    showModal: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}

export function NewAppointmentModal(props: NewAppointmentModalProps) {
    const { showModal, start, onOk, onCancel } = props;
    const appointmentStartDateTime = start ? formatFHIRDateTime(start) : formatFHIRDateTime(new Date());
    const { response, onSubmit, readOnly } = useQuestionnaireResponseForm({
        onSuccess: onOk,
        questionnaireResponseSaveService: inMemorySaveService,
        questionnaireLoader: { type: 'id', questionnaireId: 'new-appointment' },
        launchContextParameters: [
            {
                name: 'patient',
                resource: { resourceType: 'Patient' },
            },
            {
                name: 'practitionerRole',
                resource: props.practitionerRole,
            },
            {
                name: 'appointment',
                resource: {
                    resourceType: 'Appointment',
                    start: appointmentStartDateTime,
                    status: 'pending',
                    participant: [{ status: 'accepted' }],
                },
            },
        ],
    });
    return (
        <Modal title="New Appointment" open={showModal} footer={null} onCancel={onCancel}>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(formData) => {
                    return (
                        <BaseQuestionnaireResponseForm formData={formData} onSubmit={onSubmit} readOnly={readOnly} />
                    );
                }}
            </RenderRemoteData>
        </Modal>
    );
}
