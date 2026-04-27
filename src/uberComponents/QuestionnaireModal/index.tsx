import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { ParametersParameter, Reference } from 'fhir/r4b';
import { useState } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import {
    inMemorySaveQuestionnaireResponseService,
    persistSaveQuestionnaireReponseServiceFactory,
} from '@beda.software/fhir-questionnaire/components';
import { parseFHIRReference } from '@beda.software/fhir-react';

import { FormWrapper } from 'src/components/FormWrapper';
import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { service } from 'src/services';

export interface QuestionnaireModalProps {
    questionnaire: Reference;
    subject?: Reference;
    launchContextParameters?: ParametersParameter[];
    onSuccess?: () => void;
}

export function QuestionanireModal({
    questionnaire,
    subject,
    launchContextParameters,
    onSuccess,
}: QuestionnaireModalProps) {
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
        onSuccess?.();
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
                        saveCompletedQuestionnaireResponse:
                            typeof subject === 'undefined'
                                ? inMemorySaveQuestionnaireResponseService
                                : persistSaveQuestionnaireReponseServiceFactory(service),
                    }}
                    FormWrapper={(props) => <FormWrapper {...props} onCancel={() => setIsModalVisible(false)} />}
                />
            </Modal>
        </>
    );
}
