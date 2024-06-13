import { isSuccess, success, RemoteData, notAsked, loading, isFailure, isLoading, mapSuccess, sequenceArray } from "@beda.software/remote-data";
import { saveFHIRResource, service, getFHIRResources } from 'src/services/fhir'
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import config from "shared/src/config";
import { getToken } from "src/services/auth";
import { notification } from "antd";
import { Communication, Questionnaire, Reference } from "fhir/r4b";
import { selectCurrentUserRoleResource } from "src/utils/role";
import { useState } from "react";
import { RenderRemoteData, extractBundleResources, useService } from "@beda.software/fhir-react";
import { Spinner } from "src/components/Spinner";
import { ModalTrigger } from "src/components/ModalTrigger";
import { Select } from "antd";
import { isNotAsked } from "aidbox-react";

interface FillWithAudioProps {
    patientId: string
    encounterId: string
    senderReference: string
    reloadDocuments: () => void
}

function AudioRecorderButton(props: FillWithAudioProps) {
    const recorderControls = useAudioRecorder();
    const [communication, setCommunication] = useState<RemoteData<Communication>>(notAsked)
    const [communictionLoader, manager] = useService(async () => {
        const response = await getFHIRResources<Communication>("Communication", {encounter: props.encounterId, patient: props.patientId})
        if(isSuccess(response)){
            const communication = response.data.entry?.[0]?.resource;
            if(communication){
                setCommunication(success(communication))
            }
        }
        return response;
    });
    const onRecordStop = async (blob: Blob) => {
        setCommunication(loading);
        const audioFile = new File([blob], 'voice.webm', { type: blob.type });
        const formData = new FormData();
        formData.append('file', audioFile);
        const response = await service<{text: string}>({
            method: 'POST',
                baseURL: config.aiAssistantServiceUrl ?? undefined,
                url: '/transcribe',
                data: formData,
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart" },
            },
        );

        if (isSuccess(response)) {
            const communication:Communication = {
                resourceType: 'Communication',
                status: 'completed',
                subject: {reference: `/Patient/${props.patientId}`},
                encounter: {reference: `/Encounter/${props.encounterId}`},
                sender: {reference: props.senderReference},
                payload: [
                    {contentString: response.data.text}
                ]
            }
            setCommunication(success(communication));
        } else {
            notification.error({ message: JSON.stringify(response.error) });
            setCommunication(response);
        }
    };


    return (
        <div>
            <RenderRemoteData
                remoteData={isLoading(communictionLoader) ? communictionLoader : communication}
                renderLoading={Spinner}
                renderNotAsked={()=> <p>
                    Run medical scribe
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
                </p>}
            >
                {(communication) =>
                    <RecordedNotes communication={communication} reload={manager.reload} reloadDocuments={props.reloadDocuments}/>
                }
            </RenderRemoteData>
        </div>
    );
}

interface AIScribeProps {
    patientId: string
    encounterId: string
    reloadDocuments: () => void
}

export function AIScribe(props: AIScribeProps){
    const role = selectCurrentUserRoleResource();
    const senderReference = `${role.resourceType}/${role.id}`;
    return <AudioRecorderButton {...props} senderReference={senderReference} />
}

interface RecordedNotesProps {
    communication: Communication;
    reload: () => void
    reloadDocuments: () => void
}

function RecordedNotes({ communication, reload, reloadDocuments }: RecordedNotesProps){
    const originaltext = communication.payload?.[0]?.contentString ?? ""
    const [text, setText] = useState(originaltext);
    async function save(){
        const response  = await saveFHIRResource({...communication,
                                                  payload: [{contentString: text}]});
        if(isFailure(response)){
            notification.error({ message: JSON.stringify(response.error) });
        } else {
            reload()
        }
    }

    return <>
        <textarea style={{width: 1000, height: 300}} onChange={(e) => setText(e.target.value)}>{text}</textarea>
        <br/>
        {typeof communication.id === 'undefined' || text!=originaltext ?
         <button onClick={save}>save</button> :
         <Extract
             text={originaltext}
             patient={communication.subject!}
             encounter={communication.encounter!}
             reloadDocumnents={reloadDocuments}
         />}
    </>
}

interface ExtractProps {
    reloadDocumnents: () => void
    encounter: Reference;
    patient: Reference;
    text: string;
}

function Extract(props: ExtractProps){
    const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<Array<string>>([])
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

    const [extractionRD, setExtarction] = useState<RemoteData<unknown>>(notAsked)

    async function requestExtract(){
        setExtarction(loading);
        const result = sequenceArray(await Promise.all(selectedQuestionnaires.map(
            async (qId) => {
                return service ({
                    method: 'POST',
                    baseURL: config.aiAssistantServiceUrl ?? undefined,
                    url: '/extract',
                    data: {
                        ...props,
                        questionnaire: qId,
                    },
                    headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart" },
                })
        })));
        if(isSuccess(result)){
            props.reloadDocumnents();
        }
        setExtarction(result);
    }


    if(isNotAsked(extractionRD)){
        return (
            <ModalTrigger
                title="Extract medical documents"
                trigger={<button>Extract medical documents</button>}>
                {() => <>
                    <p>Select questionnires to fullfill</p>
                <RenderRemoteData
                    remoteData={questionnairesResponse}
                >
                    {(questionnaires) => (
                        <>
                            <Select
                                value={selectedQuestionnaires}
                                mode="multiple"
                                style={{width: '100%'}}
                                onChange={handleChange}
                            >
                                {questionnaires.map(q => (
                                    <Select.Option value={q.id} key={q.id}>
                                    {q.title ?? q.name ?? q.id}
                                    </Select.Option>))}
                            </Select>
                        {selectedQuestionnaires.length > 0 ? <button onClick={requestExtract}>Extarct</button> : null}
                        </>
                    )}
                </RenderRemoteData>
                </>
                }
            </ModalTrigger>
        );
    }
    return (
        <RenderRemoteData remoteData={extractionRD}>{()=><br/>}</RenderRemoteData>
    );
}
