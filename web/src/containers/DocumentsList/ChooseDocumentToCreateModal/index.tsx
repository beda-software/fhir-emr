import { Trans } from '@lingui/macro';
import { Button, Modal, ModalProps, notification, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient, Questionnaire } from 'shared/src/contrib/aidbox';

import { Spinner } from 'src/components/Spinner';

interface Props extends ModalProps {
    patient: Patient;
    subjectType?: string;
}

export const ChooseDocumentToCreateModal = (props: Props) => {
    const { subjectType } = props;
    const [questionnaireId, setQuestionnaireId] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const routeToOpen = `${location.pathname}/new/${questionnaireId}`;
    const [questionnairesResponse] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', {
                'subject-type': subjectType ? [subjectType] : [],
            }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        ),
    );

    useEffect(() => {
        if (!props.patient.name && props.open) {
            notification.info({ message: 'The patient does not have a name' });
        }
    }, [props.open, props.patient.name]);

    return (
        <>
            <Modal
                title="Create document"
                footer={[
                    <Button key="back" onClick={(e: any) => props.onCancel?.(e)}>
                        <Trans>Cancel</Trans>
                    </Button>,
                    <Button
                        key="create"
                        disabled={!questionnaireId || !props.patient.name}
                        onClick={() => navigate(routeToOpen)}
                        type="primary"
                    >
                        Create
                    </Button>,
                ]}
                {...props}
            >
                <RenderRemoteData renderLoading={Spinner} remoteData={questionnairesResponse}>
                    {(questionnaires) => (
                        <>
                            <Radio.Group
                                onChange={(e) => setQuestionnaireId(e.target.value)}
                                value={questionnaireId}
                            >
                                <Space direction="vertical">
                                    {questionnaires.map((q) => (
                                        <Radio value={q.id} key={`create-document-${q.id}`}>
                                            {q.name}
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>
                        </>
                    )}
                </RenderRemoteData>
            </Modal>
        </>
    );
};
