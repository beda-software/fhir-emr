import { Modal } from 'antd';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { PractitionerRole } from 'shared/src/contrib/aidbox';
import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface NewAppointmentModalProps {
    practitionerRole: PractitionerRole;
    isModalOpen: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}

export function NewAppointmentModal(props: NewAppointmentModalProps) {
    const { response, onSubmit, readOnly, onCancel } = useQuestionnaireResponseForm({
        onSuccess: props.onOk,
        onCancel: props.onCancel,
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
        ],
    });
    return (
        <Modal title="New Appointment" open={props.isModalOpen} footer={null} onCancel={onCancel}>
            <RenderRemoteData remoteData={response}>
                {(formData) => {
                    return (
                        <BaseQuestionnaireResponseForm
                            formData={formData}
                            onSubmit={onSubmit}
                            readOnly={readOnly}
                        />
                    );
                }}
            </RenderRemoteData>
        </Modal>
    );
}
