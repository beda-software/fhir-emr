import { t } from '@lingui/macro';
import { PractitionerRole } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { inMemorySaveService } from 'src/hooks/questionnaire-response-form-data';
import { BaseQuestionnaireResponseForm } from 'src/packages/@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/BaseQuestionnaireResponseForm';
import { service } from 'src/services';

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
                {(formData) => (
                    <BaseQuestionnaireResponseForm
                        formData={formData}
                        onSubmit={onSubmit}
                        fhirService={service}
                        groupItemComponent={GroupItemComponent}
                        FormWrapper={(props) => <FormWrapper {...props} formData={formData} onCancel={onClose} />}
                    />
                )}
            </RenderRemoteData>
        </Modal>
    );
}
