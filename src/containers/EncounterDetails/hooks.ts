import { t } from '@lingui/macro';
import { notification } from 'antd';
import { Communication, Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { extractBundleResources, formatError, formatFHIRDateTime, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources, saveFHIRResource } from 'src/services/fhir';
import { formatHumanDateTime } from 'src/utils';

export interface DocumentType {
    title: string;
    context?: string;
}

export interface EncounterDetailsProps {
    patient: Patient;
    hideControls?: boolean;
    documentTypes?: Array<DocumentType>;
    openNewTab?: boolean;
    displayShareButton?: boolean;
}

export function useEncounterDetails(props: EncounterDetailsProps) {
    const { patient } = props;
    const { encounterId } = useParams<{ encounterId: string }>();

    const defaultDocument: DocumentType = {
        title: t`Create document`,
    };

    const documentTypes = props.documentTypes ?? [defaultDocument];

    const [encounterInfoRD, manager] = useService(async () => {
        const response = await getFHIRResources<Encounter | PractitionerRole | Practitioner | Patient>('Encounter', {
            _id: encounterId,
            patient: patient.id,
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
                humanReadableDate: encounter?.period?.start && formatHumanDateTime(encounter?.period?.start),
                encounter: encounter,
            };
        });
    });

    const completeEncounter = useCallback(
        async (encounter: Encounter) => {
            const saveResponse = await saveFHIRResource<Encounter>({
                ...encounter,
                status: 'finished',
                period: {
                    start: encounter.period?.start,
                    end: formatFHIRDateTime(new Date()),
                },
            });

            if (isSuccess(saveResponse)) {
                manager.set((currentData) => ({
                    ...currentData,
                    encounter: saveResponse.data,
                }));
            } else {
                notification.error({ message: formatError(saveResponse.error) });
            }
        },
        [manager],
    );

    const [communicationResponse] = useService(async () =>
        getFHIRResources<Communication>('Communication', {
            encounter: encounterId,
            patient: patient.id,
        }),
    );

    return { encounterInfoRD, completeEncounter, manager, communicationResponse, documentTypes };
}

export function useNavigateToEncounter() {
    const navigate = useNavigate();

    const navigateToEncounter = (patientId: string, encounterId: string) => {
        navigate(`/patients/${patientId}/encounters/${encounterId}`);
    };

    return { navigateToEncounter };
}
