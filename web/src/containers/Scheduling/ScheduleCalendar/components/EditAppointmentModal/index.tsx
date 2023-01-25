import { Layout, Modal } from 'antd';
import { Content } from 'antd/lib/layout/layout';

import {
    inMemorySaveService,
    useQuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';
import { sharedPractitionerRole } from 'shared/src/sharedPractitionerRole';

import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

interface Props {
    appointmentId: string;
    onSubmit: () => void;
    onClose: () => void;
    showModal: boolean;
}

export function EditAppointmentModal(props: Props) {
    const { showModal, onClose, appointmentId } = props;
    const [practitionerRole] = sharedPractitionerRole.useSharedState();
    const { response, handleSave } = useQuestionnaireResponseFormData(
        {
            questionnaireLoader: { type: 'id', questionnaireId: 'edit-appointment' },
            questionnaireResponseSaveService: inMemorySaveService,
            launchContextParameters: [
                { name: 'CurrentAppointmentId', value: { string: appointmentId } },
                { name: 'OrganizationId', value: { string: practitionerRole.organization?.id } },
            ],
        },
        [appointmentId],
    );

    return (
        <Modal
            visible={showModal}
            title="Edit Appointment"
            onOk={props.onSubmit}
            onCancel={onClose}
        >
            <Layout>
                <Content style={{ padding: 16, backgroundColor: 'white' }}>
                    <RenderRemoteData remoteData={response}>
                        {(formData) => (
                            <QuestionnaireResponseForm
                                formData={formData}
                                handleSave={handleSave}
                            />
                        )}
                    </RenderRemoteData>
                </Content>
            </Layout>
        </Modal>
    );
}
