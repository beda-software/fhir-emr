import { DeleteOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Tooltip } from 'antd';
import { Resource } from 'fhir/r4b';
import { useCallback } from 'react';

import { FormWrapperProps } from '@beda.software/fhir-questionnaire/components';
import { RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components';
import { AlertMessage } from 'src/components/AlertMessage';
import { FormWrapper } from 'src/components/FormWrapper';
import { QuestionnaireResponseForm, QRFProps } from 'src/components/QuestionnaireResponseForm';
import {
    QuestionnaireResponseDraftService,
    QuestionnaireResponseFormSaveResponse,
    useQuestionnaireResponseDraft,
} from 'src/hooks';

interface BaseQuestionnaireResponseFormDraftProps extends QRFProps {
    autoSave: boolean;
    qrDraftServiceType: QuestionnaireResponseDraftService;
}

interface BaseQuestionnaireResponseFormDraftServerProps extends BaseQuestionnaireResponseFormDraftProps {
    qrDraftServiceType: 'server';
}

interface BaseQuestionnaireResponseFormDraftLocalProps extends BaseQuestionnaireResponseFormDraftProps {
    qrDraftServiceType: 'local';
    subject: Resource;
    questionnaireId: string;
}

type QuestionnaireResponseFormDraftProps =
    | BaseQuestionnaireResponseFormDraftServerProps
    | BaseQuestionnaireResponseFormDraftLocalProps;

export function QuestionnaireResponseFormDraft(props: QuestionnaireResponseFormDraftProps) {
    const { qrDraftServiceType } = props;
    const { response, draftInfoMessage, deleteDraft, handleEdit, saveDraft } = useQuestionnaireResponseDraft(
        props.qrDraftServiceType === 'server'
            ? {
                  autoSave: props.autoSave,
                  qrDraftServiceType: props.qrDraftServiceType,
                  questionnaireResponse: props.initialQuestionnaireResponse,
              }
            : {
                  autoSave: props.autoSave,
                  qrDraftServiceType: props.qrDraftServiceType,
                  questionnaireResponse: props.initialQuestionnaireResponse,
                  subject: props.subject,
                  questionnaireId: props.questionnaireId,
              },
    );

    const draftFormWrapper = useCallback(
        (wrapperProps: FormWrapperProps) => (
            <FormWrapper {...wrapperProps} onSaveDraft={qrDraftServiceType === 'server' ? saveDraft : undefined} />
        ),
        [qrDraftServiceType, saveDraft],
    );

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
                        onEdit={handleEdit}
                        FormWrapper={draftFormWrapper}
                    />
                </>
            )}
        </RenderRemoteData>
    );
}
