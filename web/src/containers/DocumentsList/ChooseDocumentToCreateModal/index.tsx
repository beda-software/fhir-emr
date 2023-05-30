import { t, Trans } from '@lingui/macro';
import { Button, ModalProps, notification, Radio, Space } from 'antd';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources, WithId } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { Encounter, Patient, Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from 'src/components/Modal';
import { Spinner } from 'src/components/Spinner';

interface Props extends ModalProps {
    patient: Patient;
    subjectType?: string;
    encounter?: WithId<Encounter>;
    onCancel: () => void;
}

export const ChooseDocumentToCreateModal = (props: Props) => {
    const { subjectType, patient, encounter, onCancel } = props;
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

    const onCloseModal = useCallback(() => {
        onCancel();
        setQuestionnaireId(undefined);
    }, [onCancel]);

    return (
        <>
            <Modal
                title="Create document"
                footer={[
                    <Button key="back" onClick={onCloseModal}>
                        <Trans>Cancel</Trans>
                    </Button>,
                    <Button
                        key="share-link"
                        disabled={!questionnaireId}
                        onClick={() => {
                            const questionnaireParams = _.compact([
                                `patient=${patient.id}`,
                                `questionnaire=${questionnaireId}`,
                                encounter?.id ? `encounter=${encounter.id}` : null,
                            ]);
                            navigator.clipboard.writeText(
                                `${window.location.origin}/questionnaire?${questionnaireParams.join('&')}`,
                            );
                            notification.success({
                                message: t`The link was copied to clipboard`,
                            });
                            onCloseModal();
                        }}
                    >
                        <Trans>Share link</Trans>
                    </Button>,
                    <Button
                        key="create"
                        disabled={!questionnaireId}
                        onClick={() => navigate(routeToOpen)}
                        type="primary"
                    >
                        <Trans>Create</Trans>
                    </Button>,
                ]}
                {...props}
            >
                <RenderRemoteData renderLoading={Spinner} remoteData={questionnairesResponse}>
                    {(questionnaires) => (
                        <>
                            <Radio.Group onChange={(e) => setQuestionnaireId(e.target.value)} value={questionnaireId}>
                                <Space direction="vertical">
                                    {questionnaires.sort().map((q) => (
                                        <Radio value={q.id} key={`create-document-${q.id}`}>
                                            {q.title}
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
