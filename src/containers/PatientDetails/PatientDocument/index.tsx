import { DeleteOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Space, Splitter, Tooltip } from 'antd';
import classNames from 'classnames';
import { ParametersParameter, Patient, QuestionnaireResponse } from 'fhir/r4b';
import React, { useCallback, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { getFirstParameter, mergeLaunchContextParameters, useClinicalContext } from '@beda.software/fhir-questionnaire';
import { BaseQuestionnaireResponseForm, FormWrapperProps } from '@beda.software/fhir-questionnaire/components';
import { formatError, getReference, RenderRemoteData } from '@beda.software/fhir-react';
import { RemoteDataResult } from '@beda.software/remote-data';

import { Text } from 'src/components';
import { AlertMessage } from 'src/components/AlertMessage';
import {
    ItemControlGroupItemWidgetsContext,
    ItemControlQuestionItemWidgetsContext,
} from 'src/components/BaseQuestionnaireResponseForm/context';
import {
    groupControlComponents,
    itemComponents,
    itemControlComponents,
} from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { Spinner } from 'src/components/Spinner';
import { QuestionnaireResponseDraftService, QuestionnaireResponseFormSaveResponse } from 'src/hooks';
import { useQuestionnaireResponseDraft } from 'src/hooks/useQuestionnaireResponseDraft';
import { service } from 'src/services';

import s from './PatientDocument.module.scss';
import { S } from './PatientDocument.styles';
import { PatientDocumentHeader } from './PatientDocumentHeader';
import { ProvenanceClinicalContext } from './ProvenanceClinicalContext';
import { usePatientDocument } from './usePatientDocument';

export interface PatientDocumentProps {
    questionnaireResponse?: Partial<QuestionnaireResponse>;
    launchContextParameters?: ParametersParameter[];
    questionnaireId?: string;
    encounterId?: string;
    onSuccess?: (resource: QuestionnaireResponseFormSaveResponse) => void;
    autoSave?: boolean;
    qrDraftServiceType?: QuestionnaireResponseDraftService;
    maxWidth?: number | string;
}

type PatientDocumentWithPatientProps = PatientDocumentProps & {
    patient: Patient;
};

interface PatientDocumentContentProps extends PatientDocumentProps {
    onCancel?: () => void;
    onEdit?: (formData: QuestionnaireResponseFormData) => Promise<any>;
    alertComponent?: React.ReactNode | (() => React.ReactNode);
    onSaveDraft?: (questionnaireResponse: QuestionnaireResponse) => Promise<RemoteDataResult<QuestionnaireResponse>>;
}

export function PatientDocument(props: PatientDocumentProps) {
    const { parameters: clinicalParams } = useClinicalContext();
    const mergedParams = mergeLaunchContextParameters(clinicalParams, props.launchContextParameters ?? []);
    const patient = getFirstParameter(mergedParams, 'Patient')?.resource;

    if (!patient || patient?.resourceType !== 'Patient') {
        return <AlertMessage type="error" message={t`Patient context is required`} />;
    }

    return <PatientDocumentWithPatient {...props} patient={patient} />;
}

function PatientDocumentWithPatient(props: PatientDocumentWithPatientProps) {
    const { autoSave = false, qrDraftServiceType = 'local', patient } = props;

    const params = useParams<{ questionnaireId: string; encounterId?: string }>();

    const { response, draftInfoMessage, handleEdit, deleteDraft, saveDraft } = useQuestionnaireResponseDraft({
        subject: getReference(patient),
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
                    onEdit={handleEdit}
                    onSaveDraft={qrDraftServiceType === 'server' ? saveDraft : undefined}
                    alertComponent={
                        <AlertMessage
                            style={{ marginBottom: '20px' }}
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
    const { alertComponent, onSaveDraft, maxWidth, onEdit } = props;

    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const encounterId = props.encounterId || params.encounterId;
    const questionnaireId = props.questionnaireId || params.questionnaireId!;

    const { response, handleCancel } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId,
    });

    const PatientDocumentFormWrapper = useCallback(
        (props: FormWrapperProps) => (
            <FormWrapper {...props} onCancel={handleCancel} onSaveDraft={onSaveDraft} saveButtonTitle={`Complete`} />
        ),
        [handleCancel, onSaveDraft],
    );

    const ItemControlQuestionItemWidgetsFromContext = useContext(ItemControlQuestionItemWidgetsContext);
    const ItemControlGroupItemWidgetsFromContext = useContext(ItemControlGroupItemWidgetsContext);

    const mergedItemControlComponents = useMemo(
        () => ({
            ...itemControlComponents,
            ...ItemControlQuestionItemWidgetsFromContext,
        }),
        [ItemControlQuestionItemWidgetsFromContext],
    );

    const mergedGroupControlComponents = useMemo(
        () => ({
            ...groupControlComponents,
            ...ItemControlGroupItemWidgetsFromContext,
        }),
        [ItemControlGroupItemWidgetsFromContext],
    );

    return (
        <div className={classNames(s.container, 'app-patient-document')}>
            <S.Content $maxWidth={maxWidth}>
                <ProvenanceClinicalContext questionnaireResponse={props.questionnaireResponse}>
                    <RenderRemoteData
                        remoteData={response}
                        renderLoading={Spinner}
                        renderFailure={(error) => <AlertMessage message={formatError(error)} type="error" />}
                    >
                        {({ document: { formData, onSubmit }, source }) => {
                            if (typeof source === 'undefined') {
                                return (
                                    <>
                                        <PatientDocumentHeader formData={formData} questionnaireId={questionnaireId} />
                                        {alertComponent}
                                        <BaseQuestionnaireResponseForm
                                            formData={formData}
                                            onSubmit={onSubmit}
                                            onEdit={onEdit}
                                            questionItemComponents={itemComponents}
                                            itemControlQuestionItemComponents={mergedItemControlComponents}
                                            itemControlGroupItemComponents={mergedGroupControlComponents}
                                            fhirService={service}
                                            groupItemComponent={GroupItemComponent}
                                            FormWrapper={PatientDocumentFormWrapper}
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
                                                    onEdit={onEdit}
                                                    questionItemComponents={itemComponents}
                                                    itemControlQuestionItemComponents={mergedItemControlComponents}
                                                    itemControlGroupItemComponents={mergedGroupControlComponents}
                                                    groupItemComponent={GroupItemComponent}
                                                    FormWrapper={PatientDocumentFormWrapper}
                                                    fhirService={service}
                                                />
                                            </Splitter.Panel>
                                        </Splitter>
                                    </>
                                );
                            }
                        }}
                    </RenderRemoteData>
                </ProvenanceClinicalContext>
            </S.Content>
        </div>
    );
}
