import { Appointment, Patient, PractitionerRole } from 'fhir/r4b';
import React from 'react';

import { useService } from 'fhir-react/lib/hooks/service';
import {
    extractBundleResources,
    getAllFHIRResources,
    getFHIRResources,
    getIncludedResource,
} from 'fhir-react/lib/services/fhir';
import { mapSuccess, sequenceMap } from 'fhir-react/lib/services/service';

import { extractAppointmentPatient } from 'shared/src/utils/appointment';
import { renderHumanName } from 'shared/src/utils/fhir';

import { days } from '../Scheduling/available-time';

export function useOrganizationSchedulingSlots({
    healthcareServiceId,
    practitionerRoleId,
}: {
    healthcareServiceId?: string;
    practitionerRoleId?: string;
}) {
    const [slots] = useService(async () => {
        const response = await getAllFHIRResources<Appointment>('Appointment', {
            actor: practitionerRoleId,
            _include: 'Appointment:patient',
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
                    classNames: [`_${appointment.status}`],
                };
            });
        });
    }, [practitionerRoleId]);

    const [businessHours] = useService(async () => {
        const response = await getFHIRResources<PractitionerRole>('PractitionerRole', {
            ...(practitionerRoleId ? { _id: practitionerRoleId } : { service: healthcareServiceId }),
        });

        return mapSuccess(response, (bundle) => {
            const resMap = extractBundleResources(bundle);
            const practitionerRoles = resMap.PractitionerRole;

            return practitionerRoles.map((practitionerRole) => {
                const availableTime = practitionerRole.availableTime?.map((item) => ({
                    daysOfWeek: item.daysOfWeek?.map((dow) => days.indexOf(dow) + 1),
                    startTime: item.availableStartTime,
                    endTime: item.availableEndTime,
                }));

                return availableTime;
            });
        });
    }, [practitionerRoleId, healthcareServiceId]);

    const remoteResponses = React.useMemo(
        () =>
            sequenceMap({
                businessHours: businessHours,
                slots: slots,
            }),
        [businessHours, slots],
    );

    return { remoteResponses };
}
