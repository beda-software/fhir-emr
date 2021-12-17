import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export const ModalNewQuestionnaire = () => {
    return (
        <ModalTrigger
            title="Добавить опросник"
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    Новый опросник
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('questionnaire-create')}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: 'Опросник успешно создан' });
                    }}
                />
            )}
        </ModalTrigger>
    );
};
