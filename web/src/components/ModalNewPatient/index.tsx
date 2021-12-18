import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export const ModalNewPatient = ({ onSuccess }: { onSuccess: () => void }) => {
    return (
        <ModalTrigger
            title="Добавить пациента"
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    Новый пациент
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('patient-create')}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: 'Пациент успешно создан' });
                        onSuccess();
                    }}
                />
            )}
        </ModalTrigger>
    );
};
