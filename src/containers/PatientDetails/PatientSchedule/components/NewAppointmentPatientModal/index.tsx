import { Patient } from 'fhir/r4b';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { formatFHIRDateTime } from 'shared/src/utils/date';

import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface NewAppointmentModalProps {
    patient: Patient;
    start: Date;
    showModal: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}

export function NewAppointmentPatientModal(props: NewAppointmentModalProps) {
    const { patient, showModal, start, onOk, onCancel } = props;
    const appointmentStartDateTime = start ? formatFHIRDateTime(start) : formatFHIRDateTime(new Date());
    // const end = moment(start).add(45, 'm').toDate();
    // const appointmentEndDateTime = end ? formatFHIRDateTime(end) : formatFHIRDateTime(new Date());

    return (
        <Modal title="New Appointment" open={showModal} footer={null} onCancel={onCancel}>
            <QuestionnaireResponseForm
                onSuccess={onOk}
                questionnaireLoader={questionnaireIdLoader('new-appointment-proposed-patient')}
                launchContextParameters={[
                    {
                        name: 'patient',
                        resource: {
                            resourceType: 'Patient',
                            name: patient.name,
                            id: patient.id,
                        },
                    },
                    {
                        name: 'appointment',
                        resource: {
                            resourceType: 'Appointment',
                            start: appointmentStartDateTime,
                            status: 'proposed',
                            participant: [{ status: 'accepted' }],
                        },
                    },
                ]}
            />
        </Modal>
    );
}
