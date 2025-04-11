import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';
import _ from 'lodash';
import React from 'react';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, sequenceMap } from '@beda.software/remote-data';

import { getAllFHIRResources, getFHIRResources } from 'src/services/fhir';
import { renderHumanName } from 'src/utils/fhir';

import { days } from '../Scheduling/available-time';

export function useNewScheduling() {
    const [businessHours] = useService(async () => {
        const response = await getFHIRResources<PractitionerRole>('PractitionerRole', {});

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
    }, []);

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
                businessHours: businessHours,
                practitionerRoleFilterOptions: practitionerRoleFilterOptions,
                healthcareServiceFilterOptions: healthcareServiceFilterOptions,
            }),
        [practitionerRoleFilterOptions, businessHours, healthcareServiceFilterOptions],
    );

    return { remoteResponses };
}
