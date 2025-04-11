import { Bundle, Patient, Resource } from 'fhir/r4b';

import { compileAsArray, compileAsFirst } from 'src/utils';

export function getEventConfig(r: Resource, bundle: Bundle) {
    const getId = compileAsArray<Resource, string>('Appointment.id');
    const getStart = compileAsArray<Resource, string>('Appointment.start');
    const getEnd = compileAsArray<Resource, string>('Appointment.end');
    const getStatus = compileAsArray<Resource, string>('Appointment.status');
    const getParticipantPatientReference = compileAsArray<Resource, string>(
        "Appointment.participant.actor.where(reference.startsWith('Patient/')).first().reference",
    );
    const patientReference = getParticipantPatientReference(r)[0]!;
    const getPatientExpression = `Bundle.entry.resource.where((resourceType + '/' + id)='${patientReference}').first()`;
    const getPatientResource = compileAsFirst<Bundle, Patient>(getPatientExpression);
    const patient = getPatientResource(bundle);
    const getPatientName = compileAsArray<Patient, string>(
        "Patient.name.first().select(family + ', ' + given.join(' '))",
    );

    const id = getId(r)[0]!;
    const start = getStart(r)[0]!;
    const end = getEnd(r)[0]!;
    const status = getStatus(r)[0]!;
    const title = getPatientName(patient!)[0]!;

    return {
        id,
        title: title,
        start,
        end,
        status,
        classNames: [`_${status}`],
    };
}
