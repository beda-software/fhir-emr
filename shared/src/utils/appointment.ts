import { parseFHIRReference } from 'fhir-react/lib/utils/fhir';
import { Appointment, Reference } from 'fhir/r4b';

export function extractAppointmentPatient(appointment: Appointment): Reference | undefined {
    return extractAppointmentActor(appointment, 'Patient') as Reference | undefined;
}

export function extractAppointmentActor(appointment: Appointment, resourceType: string) {
    return appointment.participant?.find(
        (appointmentParticipant) =>
            appointmentParticipant.actor &&
            parseFHIRReference(appointmentParticipant.actor).resourceType === resourceType,
    )?.actor;
}
