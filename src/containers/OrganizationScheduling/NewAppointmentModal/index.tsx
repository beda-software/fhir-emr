import { t } from '@lingui/macro';
import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';

import { inMemorySaveQuestionnaireResponseService } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';
import { formatFHIRDateTime } from '@beda.software/fhir-react';

import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface NewAppointmentModalProps {
    practitionerRole: PractitionerRole;
    healthcareService: HealthcareService;
    practitioner: Practitioner;
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
                sdcServiceProvider={{
                    saveQuestionnaireResponse: inMemorySaveQuestionnaireResponseService,
                }}
                questionnaireLoader={{ type: 'id', questionnaireId: 'new-appointment-prefilled' }}
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
                        name: 'practitioner',
                        resource: props.practitioner,
                    },
                    {
                        name: 'healthcareService',
                        resource: props.healthcareService,
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
