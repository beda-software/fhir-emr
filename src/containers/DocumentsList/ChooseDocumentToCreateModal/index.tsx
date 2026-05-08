import { t, Trans } from '@lingui/macro';
import { Button, Flex, ModalProps, notification, Radio, Space } from 'antd';
import { Encounter, Patient, Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { extractBundleResources, RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { Modal } from 'src/components/Modal';
import { Spinner } from 'src/components/Spinner';
import { getAllFHIRResources } from 'src/services/fhir';

interface Props extends ModalProps {
    patient: Patient;
    subjectType?: string;
    encounter?: WithId<Encounter>;
    context?: string;
    onCancel: () => void;
    openNewTab?: boolean;
    displayShareButton?: boolean;
}

export const ChooseDocumentToCreateModal = (props: Props) => {
    const { subjectType, patient, encounter, onCancel, context, openNewTab, displayShareButton = true } = props;
    const [questionnaireId, setQuestionnaireId] = useState();
    const [qrCodeModalIsVisible, setQRCodeModalIsVisible] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const routeToOpen = `${location.pathname}/new/${questionnaireId}`;
    const [questionnairesResponse] = useService(
        async () =>
            mapSuccess(
                await getAllFHIRResources<Questionnaire>('Questionnaire', {
                    'subject-type': subjectType ? [subjectType] : [],
                    _sort: 'title',
                    status: 'active',
                    ...(context ? { context } : {}),
                }),
                (bundle) => extractBundleResources(bundle).Questionnaire,
            ),
        [context],
    );

    const onCloseModal = useCallback(() => {
        onCancel();
        setQuestionnaireId(undefined);
    }, [onCancel]);

    const onCloseQRCodeModal = useCallback(() => {
        setQRCodeModalIsVisible(false);
        onCloseModal();
    }, [onCloseModal]);

    const buildShareLink = useCallback(() => {
        const params = _.compact([
            `patient=${patient.id}`,
            `questionnaire=${questionnaireId}`,
            encounter?.id ? `encounter=${encounter.id}` : null,
        ]);
        return `${window.location.origin}/questionnaire?${params.join('&')}`;
    }, [patient.id, questionnaireId, encounter?.id]);

    return (
        <>
            <Modal
                title={t`Create document`}
                footer={[
                    <Button key="back" onClick={onCloseModal}>
                        <Trans>Cancel</Trans>
                    </Button>,
                    ...(displayShareButton
                        ? [
                              <Button
                                  key="share-link"
                                  disabled={!questionnaireId}
                                  onClick={() => {
                                      navigator.clipboard.writeText(buildShareLink());
                                      notification.success({
                                          message: t`The link was copied to clipboard`,
                                      });
                                      onCloseModal();
                                  }}
                              >
                                  <Trans>Share link</Trans>
                              </Button>,
                              <Button
                                  key="qr-code"
                                  disabled={!questionnaireId}
                                  onClick={() => setQRCodeModalIsVisible(true)}
                              >
                                  <Trans>QR code</Trans>
                              </Button>,
                          ]
                        : []),
                    <Button
                        key="create"
                        disabled={!questionnaireId}
                        onClick={() => (openNewTab ? window.open(routeToOpen, '_blank') : navigate(routeToOpen))}
                        type="primary"
                    >
                        <Trans>Create</Trans>
                    </Button>,
                ]}
                {...props}
                open={(props.open ?? false) && !qrCodeModalIsVisible}
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
            <Modal
                title={t`QR code`}
                open={qrCodeModalIsVisible}
                onCancel={onCloseQRCodeModal}
                footer={[
                    <Button key="back" onClick={() => setQRCodeModalIsVisible(false)}>
                        <Trans>Back</Trans>
                    </Button>,
                    <Button
                        key="copy"
                        onClick={() => {
                            navigator.clipboard.writeText(buildShareLink());
                            notification.success({
                                message: t`The link was copied to clipboard`,
                            });
                        }}
                    >
                        <Trans>Copy link</Trans>
                    </Button>,
                    <Button key="close" type="primary" onClick={onCloseQRCodeModal}>
                        <Trans>Close</Trans>
                    </Button>,
                ]}
            >
                <Flex justify="center">
                    <QRCodeSVG value={buildShareLink()} size={256} />
                </Flex>
            </Modal>
        </>
    );
};
