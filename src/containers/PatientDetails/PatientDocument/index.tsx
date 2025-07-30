import { DeleteOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Space, Splitter, Tooltip } from 'antd';
import { Organization, ParametersParameter, Patient, Person, Practitioner, QuestionnaireResponse } from 'fhir/r4b';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { Text } from 'src/components';
import { AlertMessage } from 'src/components/AlertMessage';
import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { AnxietyScore, DepressionScore } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/score';
import { Spinner } from 'src/components/Spinner';
import { QuestionnaireResponseDraftService, QuestionnaireResponseFormSaveResponse } from 'src/hooks';
import { useQuestionnaireResponseDraft } from 'src/hooks/useQuestionnaireResponseDraft';

import s from './PatientDocument.module.scss';
import { S } from './PatientDocument.styles';
import { PatientDocumentHeader } from './PatientDocumentHeader';
import { usePatientDocument } from './usePatientDocument';

export interface PatientDocumentProps {
    patient: Patient;
    author: WithId<Practitioner | Patient | Organization | Person>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    launchContextParameters?: ParametersParameter[];
    questionnaireId?: string;
    encounterId?: string;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    autoSave?: boolean;
    qrDraftServiceType?: QuestionnaireResponseDraftService;
}

interface PatientDocumentContentProps extends PatientDocumentProps {
    onCancel?: () => void;
    onQRFUpdate?: (questionnaireResponse: QuestionnaireResponse) => void;
    alertComponent?: React.ReactNode | (() => React.ReactNode);
}

export function PatientDocument(props: PatientDocumentProps) {
    const { autoSave = false, qrDraftServiceType = 'local' } = props;

    const params = useParams<{ questionnaireId: string; encounterId?: string }>();

    const {
        response,
        draftInfoMessage,
        updateDraft: onUpdateDraft,
        deleteDraft,
    } = useQuestionnaireResponseDraft({
        subject: `${props.patient.resourceType}/${props.patient.id}`,
        questionnaireId: props.questionnaireId ?? params.questionnaireId!,
        qrDraftServiceType,
        autoSave,
        questionnaireResponse: props.questionnaireResponse,
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(draftQuestionnaireResponse) => (
                <PatientDocumentContent
                    {...props}
                    key="patient-document-content"
                    questionnaireResponse={draftQuestionnaireResponse}
                    onSuccess={async (resource: QuestionnaireResponseFormSaveResponse) => {
                        if (qrDraftServiceType === 'local') {
                            await deleteDraft();
                        }
                        props.onSuccess && props.onSuccess(resource);
                    }}
                    onQRFUpdate={onUpdateDraft}
                    alertComponent={
                        <AlertMessage
                            actionComponent={
                                <Space>
                                    {qrDraftServiceType === 'local' && (
                                        <Tooltip title={t`Clear draft from local storage and reset form`}>
                                            <Button
                                                onClick={async () => {
                                                    await deleteDraft();
                                                }}
                                                danger
                                                icon={<DeleteOutlined />}
                                            />
                                        </Tooltip>
                                    )}
                                </Space>
                            }
                            message={draftInfoMessage}
                        />
                    }
                />
            )}
        </RenderRemoteData>
    );
}

function PatientDocumentContent(props: PatientDocumentContentProps) {
    const { onCancel, onQRFUpdate, alertComponent } = props;

    // additional itemControlQuestionItemComponents should be memoized
    const itemControlQuestionItemComponents = useMemo(() => {
        return {
            'anxiety-score': AnxietyScore,
            'depression-score': DepressionScore,
        };
    }, []);

    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const encounterId = props.encounterId || params.encounterId;
    const questionnaireId = props.questionnaireId || params.questionnaireId!;

    const { response } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId,
    });
    const navigate = useNavigate();

    return (
        <div className={s.container}>
            <S.Content>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {({ document: { formData, onSubmit }, source }) => {
                        if (typeof source === 'undefined') {
                            return (
                                <>
                                    <PatientDocumentHeader formData={formData} questionnaireId={questionnaireId} />
                                    {alertComponent}
                                    <BaseQuestionnaireResponseForm
                                        formData={formData}
                                        onSubmit={onSubmit}
                                        itemControlQuestionItemComponents={itemControlQuestionItemComponents}
                                        onCancel={() => {
                                            onCancel?.();
                                            navigate(-1);
                                        }}
                                        saveButtonTitle={t`Complete`}
                                        onQRFUpdate={onQRFUpdate}
                                    />
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <PatientDocumentHeader formData={formData} questionnaireId={questionnaireId} />
                                    {alertComponent}
                                    <Splitter>
                                        <Splitter.Panel min="10%" defaultSize="30%">
                                            <Text>
                                                Scribe result:
                                                <br />
                                                <br />
                                                {source.payload?.[0]?.contentString}
                                            </Text>
                                        </Splitter.Panel>
                                        <Splitter.Panel min="40%" style={{ marginLeft: 25 }}>
                                            <BaseQuestionnaireResponseForm
                                                formData={formData}
                                                onSubmit={onSubmit}
                                                itemControlQuestionItemComponents={itemControlQuestionItemComponents}
                                                onCancel={() => {
                                                    onCancel?.();
                                                    navigate(-1);
                                                }}
                                                saveButtonTitle={t`Complete`}
                                                onQRFUpdate={onQRFUpdate}
                                            />
                                        </Splitter.Panel>
                                    </Splitter>
                                </>
                            );
                        }
                    }}
                </RenderRemoteData>
            </S.Content>
        </div>
    );
}
