import { PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Patient } from 'fhir/r4b';
import { useMemo, useState } from 'react';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Role, matchCurrentUserRole } from 'src/utils/role';

export interface ModalNewEncounterProps {
    patient?: Patient;
    reloadEncounter: (resource?: any) => void;
    questionnaireId?: 'encounter-create' | 'encounter-patient-list-create';
}

export const ModalNewEncounter = ({
    patient,
    reloadEncounter,
    questionnaireId = 'encounter-create',
}: ModalNewEncounterProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const title = useMemo(
        () =>
            matchCurrentUserRole({
                [Role.Admin]: () => t`Create Encounter`,
                [Role.Patient]: () => t`Request Appointment`,
                [Role.Practitioner]: () => t`Create Encounter`,
                [Role.Receptionist]: () => t`Create Encounter`,
            }),
        [],
    );

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSuccess = (resource: any) => {
        reloadEncounter(resource);
        setIsModalVisible(false);
        notification.success({
            message: 'Encounter successfully created',
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
                {questionnaireId === 'encounter-create' ? (
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader(questionnaireId)}
                        onSuccess={handleSuccess}
                        launchContextParameters={[{ name: 'Patient', resource: patient }]}
                        onCancel={() => setIsModalVisible(false)}
                    />
                ) : (
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader(questionnaireId)}
                        onSuccess={handleSuccess}
                        onCancel={() => setIsModalVisible(false)}
                    />
                )}
            </Modal>
        </>
    );
};
