import { Appointment, Reference, Patient } from 'fhir/r4b';
import { parseFHIRReference } from 'fhir-react/lib/utils/fhir';

export function extractAppointmentPatient(
    appointment: Appointment,
): Reference | undefined {
    return extractAppointmentActor(appointment, 'Patient') as
        | Reference
        | undefined;
}

export function extractAppointmentActor(appointment: Appointment, resourceType: string) {
    return appointment.participant?.find(
        (appointmentParticipant) => parseFHIRReference(appointmentParticipant.actor).resourceType === resourceType,
    )?.actor;
}
