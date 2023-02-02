import { Layout, Modal } from 'antd';
import { Content } from 'antd/lib/layout/layout';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { PractitionerRole } from 'shared/src/contrib/aidbox';
import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

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
            <Layout>
                <Content style={{ padding: 16, backgroundColor: 'white' }}>
                    <RenderRemoteData remoteData={response}>
                        {(formData) => (
                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={onSubmit}
                            />
                        )}
                    </RenderRemoteData>
                </Content>
            </Layout>
        </Modal>
    );
}
