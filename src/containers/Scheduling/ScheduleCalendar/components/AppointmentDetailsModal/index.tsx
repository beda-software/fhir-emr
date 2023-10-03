import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Appointment, Encounter } from 'fhir/r4b';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useService } from 'fhir-react/lib/hooks/service';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { parseFHIRReference } from 'fhir-react/lib/utils/fhir';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { Spinner } from 'src/components/Spinner';
import { useNavigateToEncounter } from 'src/containers/EncounterDetails/hooks';
import { useStartEncounter } from 'src/containers/PatientDetails/PatientOverview';
import { matchCurrentUserRole, Role } from 'src/utils/role';

interface Props {
    appointmentId: string;
    status: Appointment['status'];
    onEdit: (id: string) => void;
    onClose: () => void;
    showModal: boolean;
}

function useAppointmentDetailsModal(props: Props) {
    const { appointmentId } = props;
    const { navigateToEncounter } = useNavigateToEncounter();
    const { response: questionnaireResponseRD, onSubmit } = useStartEncounter(props);
    const [encounterResponse] = useService(async () => {
        const response = await getFHIRResources<Encounter>('Encounter', {
            appointment: appointmentId,
        });

        return mapSuccess(response, (bundle) => {
            const encounter = extractBundleResources(bundle).Encounter[0];

            return { encounter };
        });
    });

    return { encounterResponse, questionnaireResponseRD, onSubmit, navigateToEncounter };
}

export function AppointmentDetailsModal(props: Props) {
    const { showModal, onClose, onEdit, appointmentId, status } = props;
    const { encounterResponse, questionnaireResponseRD, onSubmit, navigateToEncounter } =
        useAppointmentDetailsModal(props);
    const canManageEncounter = matchCurrentUserRole({
        [Role.Admin]: () => true,
        [Role.Patient]: () => false,
        [Role.Practitioner]: () => true,
        [Role.Receptionist]: () => false,
    });

    const renderFooter = () => {
        if (!isSuccess(encounterResponse) || !isSuccess(questionnaireResponseRD)) {
            return null;
        }

        if (['entered-in-error', 'cancelled'].includes(status)) {
            return null;
        }

        if (encounterResponse.data.encounter) {
            const { encounter } = encounterResponse.data;
            const patientId = parseFHIRReference(encounter.subject!).id!;

            return [
                <Button
                    key="go-to-the-encounter"
                    onClick={() => navigateToEncounter(patientId, encounter.id)}
                    type="primary"
                    disabled={!canManageEncounter}
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
                    if (isSuccess(questionnaireResponseRD)) {
                        onSubmit(questionnaireResponseRD.data);
                    }
                }}
                type="primary"
                disabled={!canManageEncounter}
            >
                <Trans>Start the encounter</Trans>
            </Button>,
        ];
    };

    return (
        <Modal open={showModal} title={t`Appointment`} footer={renderFooter()} onCancel={onClose}>
            <RenderRemoteData remoteData={questionnaireResponseRD} renderLoading={Spinner}>
                {(formData) => <ReadonlyQuestionnaireResponseForm formData={formData} />}
            </RenderRemoteData>
        </Modal>
    );
}
