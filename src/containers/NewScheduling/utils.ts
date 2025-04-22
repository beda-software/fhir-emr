import { Bundle, Patient, Resource } from 'fhir/r4b';
import _ from 'lodash';

import { extractBundleResources } from '@beda.software/fhir-react';

import { BusinessHours } from 'src/uberComponents/ResourceCalendarPage/types';
import { compileAsArray, compileAsFirst } from 'src/utils';

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
        fullResource: r,
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

export const extractGetParamValue = (
    url: string | undefined,
    paramName: string,
): string | Array<string> | undefined => {
    if (!url) return undefined;
    const queryString = url.split('?')[1];
    if (!queryString) return undefined;

    const params = new URLSearchParams(queryString);
    const values = params.getAll(paramName);

    if (values.length === 0) return undefined;
    return values.length === 1 ? values[0] : values;
};
