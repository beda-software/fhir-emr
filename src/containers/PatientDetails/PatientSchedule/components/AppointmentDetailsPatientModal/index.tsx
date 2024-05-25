import { t } from '@lingui/macro';
import { Appointment, Encounter } from 'fhir/r4b';

import { extractBundleResources, RenderRemoteData, useService } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { Spinner } from 'src/components/Spinner';
import { useNavigateToEncounter } from 'src/containers/EncounterDetails/hooks';
import { useStartEncounter } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StartEncounter/useStartEncounter';
import { getFHIRResources } from 'src/services/fhir';

interface Props {
    appointmentId: string;
    status: Appointment['status'];
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

export function AppointmentDetailsPatientModal(props: Props) {
    const { showModal, onClose } = props;
    const { questionnaireResponseRD } = useAppointmentDetailsModal(props);

    return (
        <Modal open={showModal} title={t`Appointment`} footer={null} onCancel={onClose} maskClosable={true}>
            <RenderRemoteData remoteData={questionnaireResponseRD} renderLoading={Spinner}>
                {(formData) => <ReadonlyQuestionnaireResponseForm formData={formData} />}
            </RenderRemoteData>
        </Modal>
    );
}
