import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Modal, Button } from 'antd';
import { useState } from 'react';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export const ModalNewPractitioner = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
                <Trans>Add practitioner</Trans>
            </Button>
            <Modal
                title={t`Add practitioner`}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('practitioner-create')}
                />
            </Modal>
        </>
    );
};
