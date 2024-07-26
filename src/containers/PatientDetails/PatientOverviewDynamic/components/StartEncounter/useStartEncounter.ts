import { Bundle } from 'fhir/r4b';

import { Encounter } from '@beda.software/aidbox-types';
import { extractBundleResources, WithId } from '@beda.software/fhir-react';

import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { useNavigateToEncounter } from 'src/containers/EncounterDetails/hooks';
import { StartEncounterProps } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StartEncounter';
import { inMemorySaveService } from 'src/hooks/questionnaire-response-form-data';

export function useStartEncounter(props: StartEncounterProps) {
    const { appointmentId } = props;
    const { navigateToEncounter } = useNavigateToEncounter();

    const { response, onSubmit } = useQuestionnaireResponseForm({
        questionnaireLoader: { type: 'id', questionnaireId: 'encounter-create-from-appointment' },
        questionnaireResponseSaveService: inMemorySaveService,
        launchContextParameters: [
            {
                name: 'Appointment',
                resource: {
                    resourceType: 'Appointment',
                    id: appointmentId,
                    status: 'booked',
                    participant: [{ status: 'accepted' }],
                },
            },
        ],
        onSuccess: ({ extractedBundle }: { extractedBundle: Bundle<WithId<Encounter>>[] }) => {
            // NOTE: mapper extract resources in FCE format
            const encounter = extractBundleResources(extractedBundle[0]!).Encounter[0]!;
            const patientId = encounter.subject!.id;
            navigateToEncounter(patientId, encounter.id);
            if (props.onClose) {
                props.onClose();
            }
        },
    });

    return { response, onSubmit };
}
