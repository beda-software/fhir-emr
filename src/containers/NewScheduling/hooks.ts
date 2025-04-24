import { HealthcareService, Practitioner, PractitionerRole, Appointment, Slot } from 'fhir/r4b';
import _ from 'lodash';
import React from 'react';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, sequenceMap } from '@beda.software/remote-data';

import { getAllFHIRResources } from 'src/services/fhir';
import { ResourceCalendarPageProps, EventColor } from 'src/uberComponents/ResourceCalendarPage/types';
import { questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { compileAsFirst } from 'src/utils';
import { renderHumanName } from 'src/utils/fhir';

export function useNewScheduling() {
    const [practitionerRoleFilterOptions] = useService(async () => {
        const response = await getAllFHIRResources<PractitionerRole | Practitioner>('PractitionerRole', {
            _include: ['PractitionerRole:practitioner:Practitioner'],
        });

        return mapSuccess(response, (bundle) => {
            const practitioners = extractBundleResources(bundle).Practitioner;
            const practitionerRoles = extractBundleResources(bundle).PractitionerRole;
            const filterOptions = practitionerRoles.map((pr) => {
                const currentPractitioner = practitioners.find(
                    (p) => p.id === pr?.practitioner?.reference?.split('/')[1],
                );
                return {
                    value: {
                        Coding: {
                            code: pr.id,
                            display: renderHumanName(currentPractitioner?.name?.[0]),
                        },
                    },
                };
            });

            return filterOptions;
        });
    }, []);

    const [healthcareServiceFilterOptions] = useService(async () => {
        const response = await getAllFHIRResources<HealthcareService>('HealthcareService', {});

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).HealthcareService.map((hs) => {
                return {
                    value: {
                        Coding: {
                            code: hs.id,
                            display: hs.name,
                        },
                    },
                };
            });
        });
    }, []);

    const remoteResponses = React.useMemo(
        () =>
            sequenceMap({
                practitionerRoleFilterOptions: practitionerRoleFilterOptions,
                healthcareServiceFilterOptions: healthcareServiceFilterOptions,
            }),
        [practitionerRoleFilterOptions, healthcareServiceFilterOptions],
    );

    const calendarQuestionnaireActions: ResourceCalendarPageProps<Appointment>['event']['actions'] = {
        show: questionnaireAction('Appointment details', 'edit-appointment-new'),
        create: questionnaireAction('New appointment', 'new-appointment-prefilled'),
        edit: questionnaireAction('Edit appointment', 'edit-appointment-prefilled'),
    };

    const eventData: ResourceCalendarPageProps<Appointment>['event'] = {
        actions: calendarQuestionnaireActions,
        data: {
            startExpression: compileAsFirst<Appointment, string>('Appointment.start'),
            endExpression: compileAsFirst<Appointment, string>('Appointment.end'),
            titleExpression: compileAsFirst<Appointment, string>(
                "Appointment.participant.actor.where(reference.startsWith('Patient/')).first().display",
            ),
        },
        eventColorMapping: {
            targetExpression: compileAsFirst<Appointment, string>('Appointment.status'),
            colorMapping: {
                proposed: EventColor.Default,
                pending: EventColor.ServiceCyan,
                booked: EventColor.ServiceOrange,
                arrived: EventColor.ServicePurple,
                fulfilled: EventColor.ServiceGreen,
                cancelled: EventColor.ServiceMagenta,
                waitlist: EventColor.Default,
            },
        },
    };

    const slotData: ResourceCalendarPageProps<Appointment>['slot'] = {
        searchParams: {},
        eventColorMapping: {
            targetExpression: compileAsFirst<Slot, string>('Slot.status'),
            colorMapping: {
                busy: EventColor.Default,
                free: EventColor.ServiceGreen,
                'busy-unavailable': EventColor.ServiceCyan,
                'busy-tentative': EventColor.ServiceOrange,
                'entered-in-error': EventColor.ServiceMagenta,
            },
        },
    };

    return { remoteResponses, eventData, slotData };
}
