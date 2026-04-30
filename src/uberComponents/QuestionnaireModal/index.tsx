import { PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, notification } from 'antd';
import { ParametersParameter, Reference } from 'fhir/r4b';
import { useCallback, useState } from 'react';

import { questionnaireIdLoader } from '@beda.software/fhir-questionnaire';
import {
    FormWrapperProps,
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

    const showModal = () => setIsModalVisible(true);
    const hideModal = useCallback(() => setIsModalVisible(false), []);

    const handleSuccess = () => {
        hideModal();
        notification.success({ message: t`Successfully saved` });
        onSuccess?.();
    };

    const formWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => <FormWrapper {...wrapperProps} onCancel={hideModal} />,
        [hideModal],
    );

    return (
        <>
            <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
                <span>{title}</span>
            </Button>
            <Modal
                title={title}
                open={isModalVisible}
                onCancel={hideModal}
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
                    FormWrapper={formWrapper}
                />
            </Modal>
        </>
    );
}
