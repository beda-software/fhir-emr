import { DeleteOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Tooltip } from 'antd';
import { QuestionnaireResponse, Resource } from 'fhir/r4b';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { Spinner } from 'src/components';
import { AlertMessage } from 'src/components/AlertMessage';
import { QRFProps, QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { QuestionnaireResponseFormSaveResponse, useQuestionnaireResponseDraft } from 'src/hooks';

export interface QuestionnaireResponseFormDraftProps extends QRFProps {
    subject: Resource;
    questionnaireId: string;
    questionnaireResponse: WithId<QuestionnaireResponse> | undefined;
}

export function QuestionnaireResponseFormDraft(props: QuestionnaireResponseFormDraftProps) {
    const { response, draftInfoMessage, updateDraft, deleteDraft } = useQuestionnaireResponseDraft({
        subject: props.subject,
        questionnaireId: props.questionnaireId,
        autoSave: true,
        questionnaireResponse: props.questionnaireResponse,
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(draftQuestionnaireResponse) => (
                <>
                    <AlertMessage
                        style={{ marginBottom: '20px' }}
                        actionComponent={
                            <Tooltip title={t`Clear draft from local storage and reset form`}>
                                <Button
                                    onClick={async () => {
                                        await deleteDraft();
                                    }}
                                    danger
                                    icon={<DeleteOutlined />}
                                />
                            </Tooltip>
                        }
                        message={draftInfoMessage}
                    />
                    <QuestionnaireResponseForm
                        {...props}
                        initialQuestionnaireResponse={{
                            ...props.initialQuestionnaireResponse,
                            ...draftQuestionnaireResponse,
                        }}
                        onSuccess={async (resource: QuestionnaireResponseFormSaveResponse) => {
                            await deleteDraft();
                            props.onSuccess && props.onSuccess(resource);
                        }}
                        onQRFUpdate={updateDraft}
                    />
                </>
            )}
        </RenderRemoteData>
    );
}
