import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Modal, notification } from 'antd';
import { useState } from 'react';
import Select from 'react-select';
import { QuestionItemProps } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { useFieldController } from '../BaseQuestionnaireResponseForm/hooks';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';
import { Spinner } from '../Spinner';

interface Props {
    patient: Patient;
    reloadEncounter: () => void;
}

export const ModalNewEncounter = ({ patient, reloadEncounter }: Props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSuccess = () => {
        reloadEncounter();
        setIsModalVisible(false);
        notification.success({
            message: 'Encounter successfully created',
        });
    };

    return (
        <>
            <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
                Create Encounter
            </Button>
            <Modal
                title="Create Encounter"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
                maskClosable={false}
            >
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('encounter-create')}
                    customWidgets={{
                        'practitioner-list': (passProps) => {
                            return <PractitionerListWidget {...passProps} />;
                        },
                    }}
                    onSuccess={handleSuccess}
                    launchContextParameters={[{ name: 'Patient', resource: patient }]}
                />
            </Modal>
        </>
    );
};

function PractitionerListWidget({ parentPath, questionItem }: QuestionItemProps) {
    const [practitonerRoleSelectOptionsRD] = useService(async () => {
        const bundle = await getFHIRResources<PractitionerRole | Practitioner>('PractitionerRole', {
            _include: ['PractitionerRole:practitioner:Practitioner'],
        });

        return mapSuccess(bundle, (bundle) => {
            const resourceMap = extractBundleResources(bundle);
            const practitonerRoleList = resourceMap.PractitionerRole;
            const practitionerList = resourceMap.Practitioner;

            return practitonerRoleList.map((pR) => {
                const practitioner = practitionerList.find((p) => p.id === pR.practitioner?.id);

                return {
                    value: {
                        Coding: {
                            id: pR.id,
                            code: 'PractitionerRole',
                            display: renderHumanName(practitioner?.name?.[0]),
                        },
                    },
                    label: `${renderHumanName(practitioner?.name?.[0])}, ${
                        pR.specialty?.[0]!.coding?.[0]!.display
                    }`,
                };
            });
        });
    });

    const { text, linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0];
    const { value, onChange, hidden } = useFieldController(fieldName, questionItem);

    return (
        <RenderRemoteData remoteData={practitonerRoleSelectOptionsRD} renderLoading={Spinner}>
            {(practitonerRoleSelectOptions) => (
                <Form.Item label={text} hidden={hidden}>
                    <Select
                        options={practitonerRoleSelectOptions}
                        value={value}
                        onChange={onChange}
                    />
                </Form.Item>
            )}
        </RenderRemoteData>
    );
}
