import { Modal } from 'antd';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { PractitionerRole } from 'shared/src/contrib/aidbox';
import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';
import { formatFHIRDate, formatFHIRDateTime } from 'shared/src/utils/date';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import type { NewModalData } from 'src/containers/Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';

interface NewAppointmentModalProps {
    practitionerRole: PractitionerRole;
    newModalData: NewModalData;
    onOk?: () => void;
    onCancel?: () => void;
}

export function NewAppointmentModal(props: NewAppointmentModalProps) {
    const appointmentStartDate = props.newModalData.appointmentDate.start
    ? formatFHIRDate(props.newModalData.appointmentDate.start)
    : formatFHIRDate(new Date());
    const appointmentStartDateTime = props.newModalData.appointmentDate.start
    ? formatFHIRDateTime(props.newModalData.appointmentDate.start)
    : formatFHIRDateTime(new Date())
    const { response, onSubmit, readOnly, onCancel } = useQuestionnaireResponseForm({
        onSuccess: props.onOk,
        onCancel: props.onCancel,
        questionnaireResponseSaveService: inMemorySaveService,
        questionnaireLoader: { type: 'id', questionnaireId: 'new-appointment' },
        launchContextParameters: [
            {
                name: 'patient',
                resource: { resourceType: 'Patient' },
            },
            {
                name: 'practitionerRole',
                resource: props.practitionerRole,
            },
            {
                name: 'appointmentStartDate',
                value: {
                    string: appointmentStartDate,
                },
            },
            {
                name: 'appointmentStartDateTime',
                value: {
                    string: appointmentStartDateTime,
                },
            },
        ],
    });
    return (
        <Modal
            title="New Appointment"
            open={props.newModalData.showNewAppointmentModal}
            footer={null}
            onCancel={onCancel}
        >
            <RenderRemoteData remoteData={response}>
                {(formData) => {
                    return (
                        <BaseQuestionnaireResponseForm
                            formData={formData}
                            onSubmit={onSubmit}
                            readOnly={readOnly}
                        />
                    );
                }}
            </RenderRemoteData>
        </Modal>
    );
}
