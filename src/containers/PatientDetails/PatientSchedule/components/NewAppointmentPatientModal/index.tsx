import { Patient } from 'fhir/r4b';
import moment from 'moment';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { inMemorySaveService } from 'shared/src/hooks/questionnaire-response-form-data';
import { formatFHIRDateTime } from 'shared/src/utils/date';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { Modal } from 'src/components/Modal';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Spinner } from 'src/components/Spinner';

interface NewAppointmentModalProps {
    // practitionerRole: PractitionerRole;
    patient: Patient;
    start: Date;
    // end: Date;
    showModal: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}

export function NewAppointmentPatientModal(props: NewAppointmentModalProps) {
    // console.log(props.patient)
    const { patient, showModal, start, onOk, onCancel } = props;
    // console.log(renderHumanName(patient.name[0]))
    const appointmentStartDateTime = start ? formatFHIRDateTime(start) : formatFHIRDateTime(new Date());
    const end = moment(start).add(45, 'm').toDate();
    const appointmentEndDateTime = end ? formatFHIRDateTime(end) : formatFHIRDateTime(new Date());

    const { response, onSubmit, readOnly } = useQuestionnaireResponseForm({
        onSuccess: onOk,
        questionnaireResponseSaveService: inMemorySaveService,
        questionnaireLoader: { type: 'id', questionnaireId: 'new-appointment-proposed-patient' },
        launchContextParameters: [
            {
                name: 'patient',
                resource: {
                    resourceType: 'Patient', //{ resourceType: 'Patient' },
                    name: patient.name,
                    id: patient.id,
                },
            },
            {
                name: 'appointment',
                resource: {
                    resourceType: 'Appointment',
                    start: appointmentStartDateTime,
                    end: appointmentEndDateTime,
                    status: 'proposed',
                    participant: [{ status: 'accepted' }],
                },
            },
        ],
    });

    return (
        <Modal title="New Appointment" open={showModal} footer={null} onCancel={onCancel}>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(formData) => {
                    return (
                        <>
                            {console.log(formData)}
                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={onSubmit}
                                readOnly={readOnly}
                            />
                            {/* <QuestionnaireResponseForm 
                                questionnaireLoader={questionnaireIdLoader('new-appointment-proposed-patient')}

                                // formData={formData} 
                                // onSubmit={onSubmit} 
                                readOnly={readOnly} 
                            /> */}
                        </>
                    );
                }}
            </RenderRemoteData>
        </Modal>
    );
}
