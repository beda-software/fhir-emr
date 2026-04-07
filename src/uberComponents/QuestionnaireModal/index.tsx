import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { ParametersParameter, Reference } from 'fhir/r4b';
import { useState } from 'react';

import {
    inMemorySaveQuestionnaireResponseService,
    persistSaveQuestionnaireReponseService,
} from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';
import { parseFHIRReference } from '@beda.software/fhir-react';

import { FormWrapper } from 'src/components/FormWrapper';
import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

export interface QuestionnaireModalProps {
    questionnaire: Reference;
    subject?: Reference;
    launchContextParameters?: ParametersParameter[];
}

export function QuestionanireModal({ questionnaire, subject, launchContextParameters }: QuestionnaireModalProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const title = questionnaire.display ?? questionnaire.reference ?? 'N/A';

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSuccess = () => {
        setIsModalVisible(false);
        notification.success({
            message: `Successfully saved`,
        });
    };

    return (
        <>
            <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
                <span>{title}</span>
            </Button>
            <Modal
                title={title}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
                maskClosable={false}
            >
                <QuestionnaireResponseForm
                    initialQuestionnaireResponse={{
                        questionnaire: parseFHIRReference(questionnaire).id,
                        subject,
                    }}
                    questionnaireLoader={questionnaireIdLoader(parseFHIRReference(questionnaire).id!)}
                    onSuccess={handleSuccess}
                    launchContextParameters={launchContextParameters}
                    sdcServiceProvider={{
                        saveQuestionnaireResponse:
                            typeof subject === 'undefined'
                                ? inMemorySaveQuestionnaireResponseService
                                : persistSaveQuestionnaireReponseService,
                    }}
                    FormWrapper={(props) => <FormWrapper {...props} onCancel={() => setIsModalVisible(false)} />}
                />
            </Modal>
        </>
    );
}
