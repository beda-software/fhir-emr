import { t } from '@lingui/macro';
import { Button, Splitter } from 'antd';
import { Organization, ParametersParameter, Patient, Person, Practitioner, QuestionnaireResponse } from 'fhir/r4b';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

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
    onSubmit?: (formData: QuestionnaireResponseFormData) => Promise<any>;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    onCancel?: () => void;
    onQRFUpdate?: (questionnaireResponse: QuestionnaireResponse) => void;
    autoSave?: boolean;
    qrDraftServiceType?: QuestionnaireResponseDraftService;
    alertComponent?: React.ReactNode | (() => React.ReactNode);
}

export function PatientDocument(props: PatientDocumentProps) {
    const { autoSave = false, qrDraftServiceType = 'local', onCancel, onSubmit } = props;

    const params = useParams<{ questionnaireId: string; encounterId?: string }>();

    const { draftQuestionnaireResponseRD, draftInfoMessage, onQRFUpdate, deleteDraft, submitDraft } =
        useQuestionnaireResponseDraft({
            subject: `${props.patient.resourceType}/${props.patient.id}`,
            questionnaireId: props.questionnaireId ?? params.questionnaireId!,
            questionnaireResponseId: props.questionnaireResponse?.id,
            qrDraftServiceType,
            autoSave,
            questionnaireResponse: props.questionnaireResponse,
        });

    return (
        <RenderRemoteData remoteData={draftQuestionnaireResponseRD} renderLoading={Spinner}>
            {(draftQuestionnaireResponse) => (
                <PatientDocumentContent
                    {...props}
                    key="patient-document-content"
                    questionnaireResponse={draftQuestionnaireResponse}
                    onSuccess={async (resource: QuestionnaireResponseFormSaveResponse) => {
                        await submitDraft();
                        props.onSuccess && props.onSuccess(resource);
                    }}
                    onCancel={async () => {
                        await deleteDraft();
                        onCancel?.();
                    }}
                    onQRFUpdate={onQRFUpdate}
                    onSubmit={async (formData) => {
                        await submitDraft();
                        return await onSubmit?.(formData);
                    }}
                    alertComponent={
                        <AlertMessage
                            actionComponent={
                                <Button
                                    onClick={async () => {
                                        await deleteDraft();
                                    }}
                                >
                                    {t`Clear draft`}
                                </Button>
                            }
                            message={draftInfoMessage}
                        />
                    }
                />
            )}
        </RenderRemoteData>
    );
}

function PatientDocumentContent(props: PatientDocumentProps) {
    const { onCancel, onQRFUpdate, onSubmit: onSubmitProp, alertComponent } = props;

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
                                        onSubmit={async (formData) => {
                                            await onSubmitProp?.(formData);
                                            await onSubmit(formData);
                                        }}
                                        itemControlQuestionItemComponents={{
                                            'anxiety-score': AnxietyScore,
                                            'depression-score': DepressionScore,
                                        }}
                                        onCancel={() => {
                                            onCancel?.();
                                            navigate(-1);
                                        }}
                                        saveButtonTitle={'Complete'}
                                        onQRFUpdate={onQRFUpdate}
                                    />
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <PatientDocumentHeader formData={formData} questionnaireId={questionnaireId} />
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
                                                itemControlQuestionItemComponents={{
                                                    'anxiety-score': AnxietyScore,
                                                    'depression-score': DepressionScore,
                                                }}
                                                onCancel={() => navigate(-1)}
                                                saveButtonTitle={'Complete'}
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
