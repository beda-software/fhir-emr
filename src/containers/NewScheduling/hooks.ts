import { HealthcareService, Practitioner, PractitionerRole, Appointment } from 'fhir/r4b';
import _ from 'lodash';
import React from 'react';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, sequenceMap } from '@beda.software/remote-data';

import { getAllFHIRResources } from 'src/services/fhir';
import { renderHumanName } from 'src/utils/fhir';

import { CalendarPageProps } from '../../uberComponents/CalendarPage/types';
import { calendarQuestionnaireActionConstructor } from '../../uberComponents/CalendarPage/utils';

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

    const calendarQuestionnaireActions: CalendarPageProps<Appointment>['calendarEventActions'] = {
        show: calendarQuestionnaireActionConstructor({
            title: 'Appointment details',
            questionnaireId: 'edit-appointment-new',
        }),
        create: calendarQuestionnaireActionConstructor({
            title: 'New appointment',
            questionnaireId: 'new-appointment-prefilled',
        }),
        edit: calendarQuestionnaireActionConstructor({
            title: 'Edit appointment',
            questionnaireId: 'edit-appointment-prefilled',
        }),
    };

    return { remoteResponses, calendarQuestionnaireActions };
}
