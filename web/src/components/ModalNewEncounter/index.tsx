import { PlusOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import { useState } from 'react';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export const ModalNewEncounter = () => {
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
                Добавить прием
            </Button>
            <Modal
                title="Добавить прием"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('encounter-create')}
                />
            </Modal>
        </>
    );
};
