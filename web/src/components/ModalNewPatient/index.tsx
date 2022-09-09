import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export const ModalNewPatient = () => {
    return (
        <ModalTrigger
            title={t`Add patient`}
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    <Trans>Add patient</Trans>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('patient-create')}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Patient successfully created` });
                    }}
                />
            )}
        </ModalTrigger>
    );
};
