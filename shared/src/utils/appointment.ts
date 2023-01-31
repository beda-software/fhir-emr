import { Appointment, InternalReference, Patient } from '../contrib/aidbox';

export function extractAppointmentPatient(
    appointment: Appointment,
): InternalReference<Patient> | undefined {
    return extractAppointmentActor(appointment, 'Patient') as
        | InternalReference<Patient>
        | undefined;
}

export function extractAppointmentActor(appointment: Appointment, resourceType: string) {
    return appointment.participant?.find(
        (appointmentParticipant) => appointmentParticipant.actor?.resourceType === resourceType,
    )?.actor;
}
