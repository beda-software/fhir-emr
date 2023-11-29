import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

interface ModalNewMedicationKnowledgeProps {
    onCreate: () => void;
}
export const ModalNewMedicationKnowledge = (props: ModalNewMedicationKnowledgeProps) => {
    return (
        <ModalTrigger
            title={t`Add Medication Knowledge`}
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    <span>
                        <Trans>Add medication knowledge</Trans>
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
