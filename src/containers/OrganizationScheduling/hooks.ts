import { Appointment, HealthcareService, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import _ from 'lodash';
import React from 'react';

import { extractBundleResources, getIncludedResource, useService } from '@beda.software/fhir-react';
import { mapSuccess, sequenceMap } from '@beda.software/remote-data';

import { getAllFHIRResources, getFHIRResources } from 'src/services/fhir';
import { extractAppointmentPatient } from 'src/utils/appointment';
import { renderHumanName } from 'src/utils/fhir';

import { days } from '../Scheduling/available-time';

export function useOrganizationSchedulingSlots({
    healthcareServiceId,
    practitionerRoleId,
}: {
    healthcareServiceId?: string;
    practitionerRoleId?: string;
}) {
    const [slots, slotsManager] = useService(async () => {
        const response = await getAllFHIRResources<Appointment | Patient | PractitionerRole>('Appointment', {
            actor: practitionerRoleId,
            _include: ['Appointment:patient', 'Appointment:actor:PractitionerRole'],
        });

        return mapSuccess(response, (bundle) => {
            const resMap = extractBundleResources(bundle);
            const appointments = resMap.Appointment;

            const slotsData = appointments.map((appointment) => {
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

            return {
                slotsData,
                appointments,
            };
        });
    }, [practitionerRoleId]);

    const [businessHours] = useService(async () => {
        const response = await getFHIRResources<PractitionerRole>('PractitionerRole', {
            ...(practitionerRoleId ? { _id: practitionerRoleId } : { service: healthcareServiceId }),
        });

        return mapSuccess(response, (bundle) => {
            const resMap = extractBundleResources(bundle);
            const practitionerRoles = resMap.PractitionerRole;
            const practitionerRolesWithAvailableTime = practitionerRoles.filter((pr) => !!pr.availableTime);

            return practitionerRolesWithAvailableTime.map((practitionerRole) => {
                const availableTime = practitionerRole.availableTime?.map((item) => ({
                    daysOfWeek: item.daysOfWeek?.map((dow) => days.indexOf(dow) + 1),
                    startTime: item.availableStartTime,
                    endTime: item.availableEndTime,
                }));

                return availableTime?.filter((aTime) => !_.isUndefined(aTime.daysOfWeek));
            });
        });
    }, [practitionerRoleId, healthcareServiceId]);

    const [allPractitionersAndPractitionerRoles] = useService(async () => {
        const response = await getAllFHIRResources<PractitionerRole | Practitioner>('PractitionerRole', {
            _include: ['PractitionerRole:practitioner:Practitioner'],
        });

        return mapSuccess(response, (bundle) => {
            return {
                practitioners: extractBundleResources(bundle).Practitioner,
                practitionerRoles: extractBundleResources(bundle).PractitionerRole,
            };
        });
    }, []);

    const [healthcareServices] = useService(async () => {
        const response = await getAllFHIRResources<HealthcareService>('HealthcareService', {});

        return mapSuccess(response, (bundle) => extractBundleResources(bundle).HealthcareService);
    }, []);

    const remoteResponses = React.useMemo(
        () =>
            sequenceMap({
                businessHours: businessHours,
                slots: slots,
                allPractitionersAndPractitionerRoles: allPractitionersAndPractitionerRoles,
                healthcareServices: healthcareServices,
            }),
        [allPractitionersAndPractitionerRoles, businessHours, healthcareServices, slots],
    );

    return { remoteResponses, slotsManager };
}
