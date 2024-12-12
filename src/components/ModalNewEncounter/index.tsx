import { PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, notification } from 'antd';
import { ParametersParameter, Patient } from 'fhir/r4b';
import { useMemo, useState } from 'react';

import { Modal } from 'src/components/Modal';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { Role, matchCurrentUserRole } from 'src/utils/role';

export interface ModalNewEncounterProps {
    patient: Patient;
    reloadEncounter: () => void;
    launchContextParameters?: ParametersParameter[];
}

export const ModalNewEncounter = ({ patient, launchContextParameters, reloadEncounter }: ModalNewEncounterProps) => {
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

    const handleSuccess = () => {
        reloadEncounter();
        setIsModalVisible(false);
        notification.success({
            message: t`Encounter successfully created`,
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
                    questionnaireLoader={questionnaireIdLoader('encounter-create')}
                    onSuccess={handleSuccess}
                    launchContextParameters={[
                        { name: 'Patient', resource: patient },
                        ...(launchContextParameters || []),
                    ]}
                    onCancel={() => setIsModalVisible(false)}
                />
            </Modal>
        </>
    );
};
