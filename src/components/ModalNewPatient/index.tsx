import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';

import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from '../ModalTrigger';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

interface ModalNewPatientProps {
    onCreate: () => void;
}
export const ModalNewPatient = (props: ModalNewPatientProps) => {
    return (
        <ModalTrigger
            title={t`Add patient`}
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    <span>
                        <Trans>Add patient</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('patient-create')}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Patient successfully created` });
                        props.onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
