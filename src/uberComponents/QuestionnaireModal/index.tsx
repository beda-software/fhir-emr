import { PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { ParametersParameter, Reference } from 'fhir/r4b';
import { useState } from 'react';

import { QuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import { parseFHIRReference } from '@beda.software/fhir-react';

import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { Modal } from 'src/components/Modal';
import {
    // inMemorySaveService,
    // persistSaveService,
    questionnaireIdLoader,
} from 'src/hooks/questionnaire-response-form-data';
import { serviceProvider } from 'src/services';

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
                    // questionnaireResponseSaveService={
                    //     typeof subject === 'undefined' ? inMemorySaveService : persistSaveService
                    // }
                    serviceProvider={serviceProvider}
                    FormWrapper={(props) => <FormWrapper {...props} onCancel={() => setIsModalVisible(false)} />}
                    groupItemComponent={GroupItemComponent}
                    widgetsByQuestionType={itemComponents}
                    widgetsByQuestionItemControl={itemControlComponents}
                    widgetsByGroupQuestionItemControl={groupControlComponents}
                />
            </Modal>
        </>
    );
}
