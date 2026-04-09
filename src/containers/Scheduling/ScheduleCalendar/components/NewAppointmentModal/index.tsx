import { t } from '@lingui/macro';
import { PractitionerRole } from 'fhir/r4b';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import { inMemorySaveQuestionnaireResponseService } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';
import { formatFHIRDateTime } from '@beda.software/fhir-react';

import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

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
                sdcServiceProvider={{
                    saveCompletedQuestionnaireResponse: inMemorySaveQuestionnaireResponseService,
                }}
                questionnaireLoader={questionnaireIdLoader('new-appointment')}
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
