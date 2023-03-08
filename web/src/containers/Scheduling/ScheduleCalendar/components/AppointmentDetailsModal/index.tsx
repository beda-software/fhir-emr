import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources, WithId } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Bundle, Encounter, PractitionerRole } from 'shared/src/contrib/aidbox';
import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';
import { useNavigateToEncounter } from 'src/containers/EncounterDetails/hooks';

interface Props {
    practitionerRole: PractitionerRole;
    appointmentId: string;
    onEdit: (id: string) => void;
    onClose: () => void;
    showModal: boolean;
}

function useAppointmentDetailsModal(props: Props) {
    const { onClose, appointmentId } = props;
    const { navigateToEncounter } = useNavigateToEncounter();

    const [encounterResponse] = useService(async () => {
        const response = await getFHIRResources<Encounter>('Encounter', {
            appointment: appointmentId,
        });

        return mapSuccess(response, (bundle) => {
            const encounter = extractBundleResources(bundle).Encounter[0];

            return { encounter };
        });
    });

    const { response: questionnaireResponse, onSubmit } = useQuestionnaireResponseForm({
        questionnaireLoader: { type: 'id', questionnaireId: 'encounter-create-from-appointment' },
        questionnaireResponseSaveService: inMemorySaveService,
        launchContextParameters: [{ name: 'AppointmentId', value: { string: appointmentId } }],
        onSuccess: ({ extractedBundle }: { extractedBundle: Bundle<WithId<Encounter>>[] }) => {
            const encounter = extractBundleResources(extractedBundle[0]!).Encounter[0]!;
            navigateToEncounter(encounter.subject?.id!, encounter.id);
            onClose();
        },
    });

    return { encounterResponse, questionnaireResponse, onSubmit, navigateToEncounter };
}

export function AppointmentDetailsModal(props: Props) {
    const { showModal, onClose, onEdit, appointmentId } = props;
    const { encounterResponse, questionnaireResponse, onSubmit, navigateToEncounter } =
        useAppointmentDetailsModal(props);

    const renderFooter = () => {
        if (isSuccess(encounterResponse) && encounterResponse.data.encounter) {
            const { encounter } = encounterResponse.data;

            return [
                <Button
                    key="go-to-the-encounter"
                    onClick={() => navigateToEncounter(encounter.subject?.id!, encounter.id)}
                    type="primary"
                >
                    <Trans>Go to the encounter</Trans>
                </Button>,
            ];
        }

        return [
            <Button
                key="edit"
                onClick={() => {
                    onEdit(appointmentId);
                    onClose();
                }}
            >
                <Trans>Edit</Trans>
            </Button>,
            <Button
                key="start-the-encounter"
                onClick={() => {
                    if (isSuccess(questionnaireResponse)) {
                        onSubmit(questionnaireResponse.data);
                    }
                }}
                type="primary"
            >
                <Trans>Start the encounter</Trans>
            </Button>,
        ];
    };

    return (
        <Modal
            open={showModal}
            title={t`Appointment`}
            footer={
                isSuccess(encounterResponse) && isSuccess(questionnaireResponse)
                    ? renderFooter()
                    : null
            }
            onCancel={onClose}
        >
            <RenderRemoteData remoteData={questionnaireResponse} renderLoading={Spinner}>
                {(formData) => <ReadonlyQuestionnaireResponseForm formData={formData} />}
            </RenderRemoteData>
        </Modal>
    );
}
