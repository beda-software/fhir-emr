import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { PractitionerRole } from 'shared/src/contrib/aidbox';
import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface Props {
    practitionerRole: PractitionerRole;
    appointmentId: string;
    onEdit: (id: string) => void;
    onClose: () => void;
    showModal: boolean;
}

export function AppointmentDetailsModal(props: Props) {
    const { showModal, onClose, onEdit, appointmentId } = props;

    const { response } = useQuestionnaireResponseForm({
        questionnaireLoader: { type: 'id', questionnaireId: 'edit-appointment' },
        questionnaireResponseSaveService: inMemorySaveService,
        launchContextParameters: [
            { name: 'CurrentAppointmentId', value: { string: appointmentId } },
        ],
    });

    return (
        <Modal
            open={showModal}
            title={t`Appointment`}
            footer={[
                <Button
                    key="edit"
                    onClick={() => {
                        onEdit(appointmentId);
                        onClose();
                    }}
                >
                    <Trans>Edit</Trans>
                </Button>,
                // <Button key="start-the-encounter" onClick={() => {}} type="primary">
                //     <Trans>Start the encounter</Trans>
                // </Button>,
            ]}
            onCancel={onClose}
        >
            <RenderRemoteData remoteData={response}>
                {(formData) => <ReadonlyQuestionnaireResponseForm formData={formData} />}
            </RenderRemoteData>
        </Modal>
    );
}
