import { Bundle, Patient, Resource } from 'fhir/r4b';
import _ from 'lodash';

import { extractBundleResources } from '@beda.software/fhir-react';

import { compileAsArray, compileAsFirst } from 'src/utils';

import { BusinessHours } from '../../uberComponents/CalendarPage/types';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
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

export function getBusinessHours(bundle: Bundle): BusinessHours {
    const resMap = extractBundleResources(bundle);
    const practitionerRoles = resMap.PractitionerRole;
    const practitionerRolesWithAvailableTime = practitionerRoles.filter((pr) => !!pr.availableTime);

    const result = practitionerRolesWithAvailableTime.map((practitionerRole) => {
        const availableTime = practitionerRole.availableTime?.map((item) => ({
            daysOfWeek: item.daysOfWeek?.map((dow) => days.indexOf(dow) + 1),
            startTime: item.availableStartTime,
            endTime: item.availableEndTime,
        }));

        return availableTime?.filter((aTime) => !_.isUndefined(aTime.daysOfWeek));
    });

    return result.length ? result.flat() : [];
}
