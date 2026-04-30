import { t } from '@lingui/macro';
import { PractitionerRole } from 'fhir/r4b';
import { useCallback } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import {
    FormWrapperProps,
    inMemorySaveQuestionnaireResponseService,
} from '@beda.software/fhir-questionnaire/components';

import { FormWrapper } from 'src/components/FormWrapper';
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
    const { showModal, onClose, onSubmit, appointmentId, practitionerRole } = props;

    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} onCancel={onClose} />,
        [onClose],
    );

    return (
        <Modal open={showModal} title={t`Edit Appointment`} footer={null} onCancel={onClose}>
            <QuestionnaireResponseForm
                questionnaireLoader={questionnaireIdLoader('edit-appointment')}
                sdcServiceProvider={{
                    saveCompletedQuestionnaireResponse: inMemorySaveQuestionnaireResponseService,
                }}
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
                onSuccess={() => onSubmit()}
                FormWrapper={formWrapper}
            />
        </Modal>
    );
}
