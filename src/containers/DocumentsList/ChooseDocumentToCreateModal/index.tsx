import { t, Trans } from '@lingui/macro';
import { Button, Flex, ModalProps, notification } from 'antd';
import { Encounter, Patient, Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { extractBundleResources, RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { Modal } from 'src/components/Modal';
import { Spinner } from 'src/components/Spinner';
import { getAllFHIRResources } from 'src/services/fhir';

import { DocumentCategory, groupQuestionnairesByCategory } from './categories';
import { QuestionnaireOptionCard } from './QuestionnaireOptionCard';
import { S } from './styles';

interface Props extends ModalProps {
    patient: Patient;
    subjectType?: string;
    encounter?: WithId<Encounter>;
    context?: string;
    categories?: DocumentCategory[];
    onCancel: () => void;
    openNewTab?: boolean;
    displayShareButton?: boolean;
}

export const ChooseDocumentToCreateModal = (props: Props) => {
    const {
        subjectType,
        patient,
        encounter,
        onCancel,
        context,
        categories,
        openNewTab,
        displayShareButton = true,
    } = props;
    const [questionnaireId, setQuestionnaireId] = useState();
    const [qrCodeModalIsVisible, setQRCodeModalIsVisible] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const routeToOpen = `${location.pathname}/new/${questionnaireId}`;

    const categoryCodes = categories?.length ? categories.map((c) => c.code).join(',') : undefined;

    const [questionnairesResponse] = useService(async () => {
        const contextParams = _.compact([context, categoryCodes]);
        return mapSuccess(
            await getAllFHIRResources<Questionnaire>('Questionnaire', {
                'subject-type': subjectType ? [subjectType] : [],
                _sort: 'title',
                status: 'active',
                ...(contextParams.length ? { context: contextParams } : {}),
            }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        );
    }, [context, categoryCodes]);

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
                width={880}
                {...props}
                open={(props.open ?? false) && !qrCodeModalIsVisible}
            >
                <RenderRemoteData renderLoading={Spinner} remoteData={questionnairesResponse}>
                    {(questionnaires) => (
                        <S.OptionGroup onChange={(e) => setQuestionnaireId(e.target.value)} value={questionnaireId}>
                            <QuestionnairesList questionnaires={questionnaires} categories={categories} />
                        </S.OptionGroup>
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

interface QuestionnairesListProps {
    questionnaires: Questionnaire[];
    categories?: DocumentCategory[];
}

function QuestionnairesList({ questionnaires, categories }: QuestionnairesListProps) {
    const grouped = useMemo(
        () => (categories ? groupQuestionnairesByCategory(questionnaires, categories) : null),
        [questionnaires, categories],
    );
    const [activeCode, setActiveCode] = useState<string | undefined>(categories?.[0]?.code);

    if (!grouped || !categories) {
        return (
            <S.OptionList>
                {questionnaires.map((q) => (
                    <QuestionnaireOptionCard key={q.id} questionnaire={q} />
                ))}
            </S.OptionList>
        );
    }

    const activeCategory = categories.find((c) => c.code === activeCode);
    const bucket = activeCategory ? grouped.get(activeCategory.code) ?? [] : [];

    return (
        <S.CategoryContainer>
            <S.CategorySelector
                block
                optionType="button"
                buttonStyle="solid"
                options={categories.map((c) => ({ label: c.label, value: c.code }))}
                value={activeCategory?.code}
                onChange={(e) => setActiveCode(e.target.value)}
            />
            {bucket.length === 0 ? (
                <S.EmptyState>
                    <Trans>No questionnaires available</Trans>
                </S.EmptyState>
            ) : (
                <S.OptionList>
                    {bucket.map((q) => (
                        <QuestionnaireOptionCard key={q.id} questionnaire={q} />
                    ))}
                </S.OptionList>
            )}
        </S.CategoryContainer>
    );
}
