import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

interface ModalNewMedicationKnowledgeProps {
    onCreate: () => void;
}
export const ModalNewMedicationKnowledge = (props: ModalNewMedicationKnowledgeProps) => {
    return (
        <ModalTrigger
            title={t`Add Medication`}
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    <span>
                        <Trans>Add Medication</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('medication-knowledge-create')}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Medication knowledge successfully created` });
                        props.onCreate();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
};
