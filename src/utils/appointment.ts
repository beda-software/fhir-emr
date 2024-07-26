import { Appointment, Reference } from 'fhir/r4b';

import { parseFHIRReference } from '@beda.software/fhir-react';

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
