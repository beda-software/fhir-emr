import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Modal, notification } from 'antd';
import { useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

interface Props {
    patient: Patient;
    reloadEncounter: () => void;
}

export const ModalNewEncounter = ({ patient, reloadEncounter }: Props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSuccess = () => {
        reloadEncounter();
        setIsModalVisible(false);
        notification.success({
            message: 'Encounter successfully created',
        });
    };

    return (
        <>
            <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
                <span>
                    <Trans>Create Encounter</Trans>
                </span>
            </Button>
            <Modal
                title={t`Create Encounter`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
                maskClosable={false}
            >
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('encounter-create')}
                    onSuccess={handleSuccess}
                    launchContextParameters={[{ name: 'Patient', resource: patient }]}
                    onCancel={() => setIsModalVisible(false)}
                />
            </Modal>
        </>
    );
};
