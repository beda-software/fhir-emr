import { t } from '@lingui/macro';
import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';

import { RenderRemoteData, formatFHIRDateTime } from '@beda.software/fhir-react';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { inMemorySaveService } from 'src/hooks/questionnaire-response-form-data';

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
    const { response, onSubmit, readOnly } = useQuestionnaireResponseForm({
        onSuccess: onOk,
        questionnaireResponseSaveService: inMemorySaveService,
        questionnaireLoader: { type: 'id', questionnaireId: 'new-appointment-prefilled' },
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
        ],
    });
    return (
        <Modal title={t`New Appointment`} open={showModal} footer={null} onCancel={onCancel}>
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
