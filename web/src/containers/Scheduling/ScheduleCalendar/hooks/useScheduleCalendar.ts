
import { useService } from 'fhir-react/lib/hooks/service';
import {
    extractBundleResources,
    getAllFHIRResources,
    getFHIRResource,
    getIncludedResource,
    getReference,
} from 'fhir-react/lib/services/fhir';
import { mapSuccess, sequenceMap } from 'fhir-react/lib/services/service';
import { Appointment, Patient, PractitionerRole } from 'fhir/r4b';
import moment from 'moment';
import React from 'react';

import { extractAppointmentPatient } from 'shared/src/utils/appointment';
import { formatFHIRDateTime } from 'shared/src/utils/date';
import { renderHumanName } from 'shared/src/utils/fhir';

import { days } from '../../available-time';

export function useScheduleCalendar(practitionerRole: PractitionerRole) {
    const [businessHoursRD] = useService(async () => {
        return mapSuccess(
            await getFHIRResource<PractitionerRole>(getReference(practitionerRole)),
            (resource) =>
                resource.availableTime?.map((item) => ({
                    daysOfWeek: item.daysOfWeek!.map((dow) => days.indexOf(dow) + 1),
                    startTime: item.availableStartTime,
                    endTime: item.availableEndTime,
                })),
        );
    }, []);

    // TODO: change it dynamically when user changes the calendar period significantly (3w or more)
    const periodStart = formatFHIRDateTime(moment().startOf('day').subtract(1, 'months'));
    const periodEnd = formatFHIRDateTime(moment().endOf('day').add(1, 'months'));

    const [calendarSlotsRD, slotsManager] = useService(async () => {
        const response = await getAllFHIRResources<Appointment | Patient>('Appointment', {
            actor: practitionerRole.id,
            _include: 'Appointment:patient',
            date: [`ge${periodStart}`, `lt${periodEnd}`],
        });

        return mapSuccess(response, (bundle) => {
            const resMap = extractBundleResources(bundle);
            const appointments = resMap.Appointment;

            return appointments.map((appointment) => {
                const patientRef = extractAppointmentPatient(appointment)!;
                const patient = getIncludedResource<Patient>(resMap, patientRef)!;

                return {
                    id: appointment.id,
                    title: patient?.name?.[0] ? renderHumanName(patient.name[0]) : appointment.id,
                    start: appointment.start!,
                    end: appointment.end!,
                    status: appointment.status,
                    color: appointment.status === 'cancelled' ? '#F6BF26' : '#3366FF',
                };
            });
        });
    }, [periodStart, periodEnd]);

    const remoteResponses = React.useMemo(
        () =>
            sequenceMap({
                businessHours: businessHoursRD,
                calendarSlots: calendarSlotsRD,
            }),
        [businessHoursRD, calendarSlotsRD],
    );

    return { remoteResponses, slotsManager };
}
