import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { formatError } from 'aidbox-react/lib/utils/error';

import { Encounter, Patient } from 'shared/src/contrib/aidbox';

import { Spinner } from 'src/components/Spinner';
import { DocumentsList } from 'src/containers/DocumentsList';

import { ChooseDocumentToCreateModal } from '../DocumentsList/ChooseDocumentToCreateModal';
import { PatientHeaderContext } from '../PatientDetails/PatientHeader/context';
import s from './EncounterDetails.module.scss';

interface Props {
    patient: Patient;
}

function useEncounterDetails() {
    const params = useParams<{ encounterId: string }>();

    const [response, manager] = useService(async () =>
        getFHIRResource<Encounter>({
            resourceType: 'Encounter',
            id: params.encounterId!,
        }),
    );

    const completeEncounter = useCallback(async () => {
        if (isSuccess(response)) {
            const encounter = response.data;
            const saveResponse = await saveFHIRResource({
                ...encounter,
                status: 'completed',
            });

            if (isSuccess(saveResponse)) {
                manager.set(saveResponse.data);
            } else {
                notification.error({ message: formatError(saveResponse.error) });
            }
        }
    }, [manager, response]);

    return { response, completeEncounter };
}

export const EncounterDetails = ({ patient }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const location = useLocation();
    const { response, completeEncounter } = useEncounterDetails();

    useEffect(() => {
        setBreadcrumbs({ [location?.pathname]: 'Consultation' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Title level={3} className={s.title}>
                <Trans>Consultation</Trans>
            </Title>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(encounter) => {
                    const isEncounterCompleted = encounter.status === 'completed';

                    return (
                        <>
                            <div style={{ display: 'flex', gap: 32 }}>
                                {!isEncounterCompleted ? (
                                    <Button
                                        icon={<PlusOutlined />}
                                        type="primary"
                                        onClick={() => setModalOpened(true)}
                                    >
                                        <span>
                                            <Trans>Create document</Trans>
                                        </span>
                                    </Button>
                                ) : null}
                                <Button
                                    icon={<CheckOutlined />}
                                    type="primary"
                                    onClick={() => completeEncounter()}
                                >
                                    <span>
                                        {isEncounterCompleted ? (
                                            <Trans>Encounter completed</Trans>
                                        ) : (
                                            <Trans>Complete encounter</Trans>
                                        )}
                                    </span>
                                </Button>
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
