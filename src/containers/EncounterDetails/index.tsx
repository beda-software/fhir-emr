import { AudioOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Encounter, Patient } from 'fhir/r4b';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import config from '@beda.software/emr-config';
import { RenderRemoteData } from '@beda.software/fhir-react';
import { isLoading, isSuccess } from '@beda.software/remote-data';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { Text } from 'src/components/Typography';
import { DocumentsList } from 'src/containers/DocumentsList';
import { ChooseDocumentToCreateModal } from 'src/containers/DocumentsList/ChooseDocumentToCreateModal';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { AIScribe, useAIScribe } from './AIScribe';
import { S } from './EncounterDetails.styles';
import { EncounterDetailsProps, useEncounterDetails } from './hooks';
import { PatientApps } from '../PatientDetails/PatientApps';

interface OpenModalState {
    open: boolean;
    context?: string;
}

interface EncounterAppsProps {
    patient: Patient;
    encounter: Encounter;
}

function EncounterApps({ patient, encounter }: EncounterAppsProps) {
    return <PatientApps patient={patient} encounter={encounter} />;
}

export const EncounterDetails = (props: EncounterDetailsProps) => {
    const { patient, hideControls } = props;
    const [modalOpened, setModalOpened] = useState<OpenModalState>({ open: false });
    const { encounterInfoRD, completeEncounter, manager, communicationResponse, documentTypes } =
        useEncounterDetails(props);
    const [documentListKey, setDocumentListKey] = useState(0);
    const reload = useCallback(() => setDocumentListKey((k) => k + 1), [setDocumentListKey]);

    const [showScriber, setShowScriber] = useState(false);
    const { recorderControls } = useAIScribe();

    const disableControls =
        showScriber ||
        isLoading(communicationResponse) ||
        (isSuccess(communicationResponse) && (communicationResponse.data.entry || []).length > 0);

    return (
        <>
            <S.Title level={3}>
                <Trans>Consultation</Trans>
            </S.Title>
            <RenderRemoteData remoteData={encounterInfoRD} renderLoading={Spinner}>
                {(encounterData) => {
                    const encounter = encounterData.encounter;
                    if (!encounter) {
                        return <></>;
                    }
                    const isEncounterCompleted = encounter.status === 'finished';

                    return (
                        <>
                            {hideControls ? null : (
                                <S.Controls>
                                    {!isEncounterCompleted
                                        ? documentTypes.map(({ title, context }) => (
                                              <Button
                                                  key={title}
                                                  icon={<PlusOutlined />}
                                                  type="primary"
                                                  onClick={() => setModalOpened({ open: true, context })}
                                              >
                                                  <span>{title}</span>
                                              </Button>
                                          ))
                                        : null}
                                    {!isEncounterCompleted && !config.aiAssistantServiceUrl ? (
                                        <Link
                                            to={`/encounters/${encounter.id}/video`}
                                            state={{ encounterData: encounterData }}
                                        >
                                            <Button type="primary">
                                                <span>
                                                    <Trans>Start video call</Trans>
                                                </span>
                                            </Button>
                                        </Link>
                                    ) : null}
                                    {config.aiAssistantServiceUrl && !isEncounterCompleted ? (
                                        <>
                                            <Text>
                                                <Trans>or</Trans>
                                            </Text>
                                            <Button
                                                icon={<AudioOutlined />}
                                                type="primary"
                                                onClick={() => {
                                                    setShowScriber(true);
                                                    recorderControls.startRecording();
                                                }}
                                                disabled={disableControls}
                                            >
                                                <span>
                                                    <Trans>Start scribe</Trans>
                                                </span>
                                            </Button>
                                        </>
                                    ) : null}
                                    <S.EncounterControls>
                                        {isEncounterCompleted ? (
                                            <Button
                                                icon={<CheckOutlined />}
                                                type="primary"
                                                onClick={() => completeEncounter(encounter)}
                                            >
                                                <span>
                                                    <Trans>Encounter completed</Trans>
                                                </span>
                                            </Button>
                                        ) : (
                                            <ModalCompleteEncounter
                                                onSuccess={manager.reload}
                                                encounter={encounter}
                                                disabled={false}
                                            />
                                        )}
                                    </S.EncounterControls>
                                </S.Controls>
                            )}
                            <ChooseDocumentToCreateModal
                                open={modalOpened.open}
                                onCancel={() => setModalOpened({ open: false })}
                                patient={patient}
                                subjectType="Encounter"
                                encounter={encounter}
                                context={modalOpened.context}
                                openNewTab={props.openNewTab}
                                displayShareButton={props.displayShareButton}
                            />

                            {showScriber ||
                            (isSuccess(communicationResponse) &&
                                (communicationResponse.data.entry || []).length > 0) ? (
                                <AIScribe
                                    patientId={patient.id!}
                                    encounterId={encounter.id}
                                    reloadDocuments={reload}
                                    recorderControls={recorderControls}
                                    isEncounterCompleted={isEncounterCompleted}
                                />
                            ) : null}
                            <EncounterApps patient={patient} encounter={encounter} />
                            <DocumentsList key={documentListKey} patient={patient} />
                        </>
                    );
                }}
            </RenderRemoteData>
        </>
    );
};

function ModalCompleteEncounter(props: { encounter: Encounter; onSuccess: () => void; disabled: boolean }) {
    const { encounter, disabled, onSuccess } = props;

    return (
        <ModalTrigger
            title={t`Complete encounter`}
            trigger={
                <Button icon={<CheckOutlined />} type="primary" disabled={disabled}>
                    <span>
                        <Trans>Complete encounter</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('complete-encounter')}
                    launchContextParameters={[
                        {
                            name: 'CurrentEncounter',
                            resource: encounter,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Encounter was successfully completed` });
                        onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}
