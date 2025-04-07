import { EditFilled, PlusOutlined, SaveFilled } from '@ant-design/icons';
import { Trans, t } from '@lingui/macro';
import { Button, notification, Select } from 'antd';
import { Communication, Questionnaire, Reference } from 'fhir/r4b';
import { useState } from 'react';
// eslint-disable-next-line
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import config from '@beda.software/emr-config';
import { RenderRemoteData, extractBundleResources, formatError, useService } from '@beda.software/fhir-react';
import {
    isSuccess,
    isNotAsked,
    success,
    RemoteData,
    notAsked,
    loading,
    isFailure,
    isLoading,
    mapSuccess,
    sequenceArray,
} from '@beda.software/remote-data';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { Spinner } from 'src/components/Spinner';
import { Text } from 'src/components/Typography';
import { getToken } from 'src/services/auth';
import { saveFHIRResource, service, getFHIRResources } from 'src/services/fhir';
import { selectCurrentUserRoleResource } from 'src/utils/role';

import { S } from './AIScribe.styles';

interface FillWithAudioProps {
    patientId: string;
    encounterId: string;
    senderReference: string;
    reloadDocuments: () => void;
    recorderControls: any;
    isEncounterCompleted: boolean;
}

function AudioRecorderButton(props: FillWithAudioProps) {
    const { recorderControls } = props;
    const [communication, setCommunication] = useState<RemoteData<Communication>>(notAsked);
    const [communicationResponse, manager] = useService(async () => {
        const response = await getFHIRResources<Communication>('Communication', {
            encounter: props.encounterId,
            patient: props.patientId,
        });
        if (isSuccess(response)) {
            const communication = response.data.entry?.[0]?.resource;
            if (communication) {
                setCommunication(success(communication));
            }
        }
        return response;
    });
    const onRecordStop = async (blob: Blob) => {
        setCommunication(loading);
        const audioFile = new File([blob], 'voice.webm', { type: blob.type });
        const formData = new FormData();
        formData.append('file', audioFile);
        const response = await service<{ text: string }>({
            method: 'POST',
            baseURL: config.aiAssistantServiceUrl ?? undefined,
            url: '/transcribe',
            data: formData,
            headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart' },
        });

        if (isSuccess(response)) {
            const communication: Communication = {
                resourceType: 'Communication',
                status: 'completed',
                subject: { reference: `/Patient/${props.patientId}` },
                encounter: { reference: `/Encounter/${props.encounterId}` },
                sender: { reference: props.senderReference },
                payload: [{ contentString: response.data.text }],
            };
            setCommunication(success(communication));
        } else {
            notification.error({ message: JSON.stringify(response.error) });
            setCommunication(response);
        }
    };

    return (
        <S.Container>
            <RenderRemoteData
                remoteData={isLoading(communicationResponse) ? communicationResponse : communication}
                renderLoading={Spinner}
                renderNotAsked={() => (
                    <S.Scriber>
                        <S.Title $danger>
                            <Trans>Capture in progress</Trans>
                        </S.Title>
                        <AudioRecorder
                            showVisualizer
                            onRecordingComplete={async (blob) => {
                                await onRecordStop(blob);
                            }}
                            audioTrackConstraints={{
                                noiseSuppression: true,
                                echoCancellation: true,
                            }}
                            recorderControls={recorderControls}
                        />
                    </S.Scriber>
                )}
            >
                {(communication) => (
                    <RecordedNotes
                        communication={communication}
                        reload={manager.reload}
                        reloadDocuments={props.reloadDocuments}
                        hideControls={props.isEncounterCompleted}
                    />
                )}
            </RenderRemoteData>
        </S.Container>
    );
}

interface AIScribeProps {
    patientId: string;
    encounterId: string;
    isEncounterCompleted: boolean;
    reloadDocuments: () => void;
    recorderControls: any;
}

export function useAIScribe() {
    const recorderControls: any = useAudioRecorder();

    return { recorderControls };
}

export function AIScribe(props: AIScribeProps) {
    const role = selectCurrentUserRoleResource();
    const senderReference = `${role.resourceType}/${role.id}`;

    return <AudioRecorderButton {...props} senderReference={senderReference} />;
}

interface RecordedNotesProps {
    communication: Communication;
    reload: () => void;
    reloadDocuments: () => void;
    hideControls: boolean;
}

function RecordedNotes({ hideControls, communication, reload, reloadDocuments }: RecordedNotesProps) {
    const originaltext = communication.payload?.[0]?.contentString ?? '';
    const [text, setText] = useState(originaltext);
    const [isEditingMode, setIsEditingMode] = useState(false);

    const [isExtractLoading, setIsExtractLoading] = useState(false);

    async function save() {
        const response = await saveFHIRResource({ ...communication, payload: [{ contentString: text }] });
        if (isFailure(response)) {
            notification.error({ message: JSON.stringify(response.error) });
        } else {
            setIsEditingMode(false);
            reload();
        }
    }

    const sentences = text.split('. ');

    return (
        <S.Scriber>
            <S.Title>
                <Trans>Scribe results</Trans>
            </S.Title>
            {typeof communication.id === 'undefined' || isEditingMode ? (
                <S.Textarea onChange={(e: any) => setText(e.target.value)} value={text} rows={6} />
            ) : (
                <S.TextResults>
                    <Text>{sentences.join('.\n')}</Text>
                </S.TextResults>
            )}
            {hideControls ? null : (
                <S.Controls>
                    {typeof communication.id === 'undefined' || isEditingMode ? (
                        <Button icon={<SaveFilled />} type="primary" onClick={save}>
                            <span>
                                <Trans>Save</Trans>
                            </span>
                        </Button>
                    ) : (
                        <>
                            <Extract
                                text={originaltext}
                                patient={communication.subject!}
                                encounter={communication.encounter!}
                                reloadDocumnents={reloadDocuments}
                                updateExtractLoading={setIsExtractLoading}
                            />
                            {!isExtractLoading ? (
                                <Button icon={<EditFilled />} type="default" onClick={() => setIsEditingMode(true)}>
                                    <span>
                                        <Trans>Edit</Trans>
                                    </span>
                                </Button>
                            ) : null}
                        </>
                    )}
                </S.Controls>
            )}
        </S.Scriber>
    );
}

interface ExtractProps {
    reloadDocumnents: () => void;
    encounter: Reference;
    patient: Reference;
    text: string;
    updateExtractLoading: (v: boolean) => void;
}

function Extract(props: ExtractProps) {
    const { updateExtractLoading } = props;
    const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<Array<string>>([]);
    function handleChange(value: string[]) {
        setSelectedQuestionnaires(value);
    }
    const [questionnairesResponse] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', {
                'subject-type': 'Encounter',
                _sort: 'title',
            }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        ),
    );

    const [extractionRD, setExtarction] = useState<RemoteData<unknown>>(notAsked);

    async function requestExtract() {
        updateExtractLoading(true);
        setExtarction(loading);
        const result = sequenceArray(
            await Promise.all(
                selectedQuestionnaires.map(async (qId) => {
                    return service({
                        method: 'POST',
                        baseURL: config.aiAssistantServiceUrl ?? undefined,
                        url: '/extract',
                        data: {
                            ...props,
                            questionnaire: qId,
                        },
                        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart' },
                    });
                }),
            ),
        );
        if (isSuccess(result)) {
            notification.success({ message: t`Documents have been successfully extracted` });
            props.reloadDocumnents();
        }
        setExtarction(result);
        updateExtractLoading(false);
    }

    if (isNotAsked(extractionRD)) {
        return (
            <ModalTrigger
                title={t`Extract medical documents`}
                trigger={
                    <Button icon={<PlusOutlined />} type="primary">
                        <span>
                            <Trans>Extract documents</Trans>
                        </span>
                    </Button>
                }
            >
                {() => (
                    <>
                        <p>Select questionnires to fullfill</p>
                        <RenderRemoteData remoteData={questionnairesResponse}>
                            {(questionnaires) => (
                                <>
                                    <Select
                                        value={selectedQuestionnaires}
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        onChange={handleChange}
                                    >
                                        {questionnaires.map((q) => (
                                            <Select.Option value={q.id} key={q.id}>
                                                {q.title ?? q.name ?? q.id}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <S.ModalFooter>
                                        <Button
                                            type="primary"
                                            onClick={requestExtract}
                                            disabled={selectedQuestionnaires.length === 0}
                                        >
                                            <Trans>Extract</Trans>
                                        </Button>
                                    </S.ModalFooter>
                                </>
                            )}
                        </RenderRemoteData>
                    </>
                )}
            </ModalTrigger>
        );
    }

    return (
        <RenderRemoteData
            remoteData={extractionRD}
            renderLoading={() => <Text> ${t`Loading...`}</Text>}
            renderFailure={(error) => <Text>{formatError(error)}</Text>}
        >
            {() => <></>}
        </RenderRemoteData>
    );
}
