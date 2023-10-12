import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Encounter, Patient } from 'fhir/r4b';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useService } from 'fhir-react/lib/hooks/service';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { getFHIRResource, saveFHIRResource } from 'fhir-react/lib/services/fhir';
import { formatFHIRDateTime } from 'fhir-react/lib/utils/date';
import { formatError } from 'fhir-react/lib/utils/error';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { DocumentsList } from 'src/containers/DocumentsList';
import { ChooseDocumentToCreateModal } from 'src/containers/DocumentsList/ChooseDocumentToCreateModal';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

import { S } from './EncounterDetails.styles';

interface Props {
    patient: Patient;
}

function useEncounterDetails() {
    const params = useParams<{ encounterId: string }>();

    const [response, manager] = useService(async () =>
        getFHIRResource<Encounter>({
            reference: `Encounter/${params.encounterId}`,
        }),
    );

    const completeEncounter = useCallback(async () => {
        if (isSuccess(response)) {
            const encounter = response.data;
            const saveResponse = await saveFHIRResource<Encounter>({
                ...encounter,
                status: 'finished',
                period: {
                    start: encounter.period?.start,
                    end: formatFHIRDateTime(new Date()),
                },
            });

            if (isSuccess(saveResponse)) {
                manager.set(saveResponse.data);
            } else {
                notification.error({ message: formatError(saveResponse.error) });
            }
        }
    }, [manager, response]);

    return { response, completeEncounter, manager };
}

export const EncounterDetails = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { response, completeEncounter, manager } = useEncounterDetails();

    usePatientHeaderLocationTitle({ title: t`Consultation` });

    return (
        <>
            <S.Title level={3}>
                <Trans>Consultation</Trans>
            </S.Title>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(encounter) => {
                    const isEncounterCompleted = encounter.status === 'finished';

                    return (
                        <>
                            <div style={{ display: 'flex', gap: 32 }}>
                                {!isEncounterCompleted ? (
                                    <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpened(true)}>
                                        <span>
                                            <Trans>Create document</Trans>
                                        </span>
                                    </Button>
                                ) : null}
                                {isEncounterCompleted ? (
                                    <Button icon={<CheckOutlined />} type="primary" onClick={() => completeEncounter()}>
                                        <span>
                                            <Trans>Encounter completed</Trans>
                                        </span>
                                    </Button>
                                ) : (
                                    <ModalCompleteEncounter onSuccess={manager.reload} encounter={encounter} />
                                )}
                                <ChooseDocumentToCreateModal
                                    open={modalOpened}
                                    onCancel={() => setModalOpened(false)}
                                    patient={patient}
                                    subjectType="Encounter"
                                    encounter={encounter}
                                />
                            </div>

                            <DocumentsList patient={patient} />
                        </>
                    );
                }}
            </RenderRemoteData>
        </>
    );
};

function ModalCompleteEncounter(props: { encounter: Encounter; onSuccess: () => void }) {
    return (
        <ModalTrigger
            title={t`Complete encounter`}
            trigger={
                <Button icon={<CheckOutlined />} type="primary">
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
                            resource: props.encounter,
                        },
                    ]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Encounter was successfully completed` });
                        props.onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}
