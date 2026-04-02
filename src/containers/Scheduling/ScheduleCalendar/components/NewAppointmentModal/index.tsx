import { t } from '@lingui/macro';
import { PractitionerRole } from 'fhir/r4b';

import { formatFHIRDateTime } from '@beda.software/fhir-react';

import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { inMemorySaveService } from 'src/hooks/questionnaire-response-form-data';

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

    return (
        <Modal title={t`New Appointment`} open={showModal} footer={null} onCancel={onCancel}>
            <QuestionnaireResponseForm
                onSuccess={onOk}
                questionnaireResponseSaveService={inMemorySaveService}
                questionnaireLoader={{ type: 'id', questionnaireId: 'new-appointment' }}
                launchContextParameters={[
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
                ]}
            />
        </Modal>
    );
}
