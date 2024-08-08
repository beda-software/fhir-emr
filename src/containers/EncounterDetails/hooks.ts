import { notification } from 'antd';
import { Communication, Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { extractBundleResources, formatError, formatFHIRDateTime, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources, saveFHIRResource } from 'src/services/fhir';
import { formatHumanDateTime } from 'src/utils';

export interface EncounterDetailsProps {
    patient: Patient;
}

export function useEncounterDetails(props: EncounterDetailsProps) {
    const { patient } = props;
    const params = useParams<{ encounterId: string }>();
    const { encounterId } = params;

    const [encounterInfoRD, manager] = useService(async () => {
        const response = await getFHIRResources<Encounter | PractitionerRole | Practitioner | Patient>('Encounter', {
            _id: encounterId,
            _include: [
                'Encounter:subject',
                'Encounter:participant:PractitionerRole',
                'PractitionerRole:practitioner:Practitioner',
            ],
        });
        return mapSuccess(response, (bundle) => {
            const sourceMap = extractBundleResources(bundle);
            const encounter = sourceMap.Encounter[0];
            const patient = sourceMap.Patient[0];
            const practitioner = sourceMap.Practitioner[0];

            return {
                id: encounter?.id,
                patient,
                practitioner: practitioner,
                status: encounter?.status,
                period: encounter?.period,
                humanReadableDate: encounter?.period?.start && formatHumanDateTime(encounter?.period?.start),
                encounter: encounter,
            };
        });
    });

    const completeEncounter = useCallback(async () => {
        if (isSuccess(encounterInfoRD)) {
            const encounter = encounterInfoRD.data.encounter as Encounter;

            const saveResponse = await saveFHIRResource<Encounter>({
                ...encounter,
                status: 'finished',
                period: {
                    start: encounter.period?.start,
                    end: formatFHIRDateTime(new Date()),
                },
            });

            if (isSuccess(saveResponse)) {
                manager.set({
                    ...encounterInfoRD.data,
                    encounter: saveResponse.data,
                });
            } else {
                notification.error({ message: formatError(saveResponse.error) });
            }
        }
    }, [manager, encounterInfoRD]);

    const [communicationResponse] = useService(async () =>
        getFHIRResources<Communication>('Communication', {
            encounter: encounterId,
            patient: patient.id,
        }),
    );

    return { encounterInfoRD, completeEncounter, manager, communicationResponse };
}

export function useNavigateToEncounter() {
    const navigate = useNavigate();

    const navigateToEncounter = (patientId: string, encounterId: string) => {
        navigate(`/patients/${patientId}/encounters/${encounterId}`);
    };

    return { navigateToEncounter };
}
