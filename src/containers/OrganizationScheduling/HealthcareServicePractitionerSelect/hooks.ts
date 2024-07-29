import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useCallback, useState } from 'react';

import { extractBundleResources, getReference } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';
import { practitionerRoleDoctor } from 'src/utils/constants';
import { renderHumanName } from 'src/utils/fhir';

import { SelectOption } from './types';
import { getSelectedValue } from '../utils';

export function useHealthcareServicePractitionerSelect() {
    const [selectedHealthcareService, setSelectedHealthcareService] = useState<SelectOption>(null);
    const [selectedPractitionerRole, setSelectedPractitionerRole] = useState<SelectOption>(null);

    const onChange = useCallback(
        (selectedOption: SelectOption, type: 'healthcareService' | 'practitionerRole') => {
            const combinedValue = {
                healthcareService: getSelectedValue(selectedHealthcareService),
                practitionerRole: getSelectedValue(selectedPractitionerRole),
            };

            if (type === 'healthcareService') {
                setSelectedHealthcareService(selectedOption);
                combinedValue.healthcareService = getSelectedValue(selectedOption);
            } else if (type === 'practitionerRole') {
                setSelectedPractitionerRole(selectedOption);
                combinedValue.practitionerRole = getSelectedValue(selectedOption);
            }
        },
        [selectedHealthcareService, selectedPractitionerRole],
    );

    const healthcareServiceOptions = useCallback(
        async (search: string) => {
            const healthcareServicesResponse = selectedPractitionerRole
                ? await getFHIRResources<PractitionerRole | HealthcareService>('PractitionerRole', {
                      'service:HealthcareService.name': search,
                      _id: getSelectedValue(selectedPractitionerRole),
                      _include: ['PractitionerRole:service:HealthcareService'],
                  })
                : await getFHIRResources<HealthcareService>('HealthcareService', { name: search });
            const response = mapSuccess(
                healthcareServicesResponse,
                (bundle) => extractBundleResources(bundle).HealthcareService,
            );

            if (isSuccess(response)) {
                return response.data.map((resource) => {
                    return {
                        value: resource.id,
                        label: resource.type?.[0]?.text ?? resource.name,
                    };
                });
            }

            return [];
        },
        [selectedPractitionerRole],
    );

    const practitionerRoleOptions = useCallback(
        async (search: string) => {
            const practitionerRoleResponse = await getFHIRResources<PractitionerRole | Practitioner>(
                'PractitionerRole',
                {
                    role: practitionerRoleDoctor,
                    'practitioner:Practitioner.name': search,
                    _include: ['PractitionerRole:practitioner:Practitioner'],
                    ...(selectedHealthcareService ? { service: getSelectedValue(selectedHealthcareService) } : {}),
                },
            );
            const response = mapSuccess(practitionerRoleResponse, (bundle) => {
                const practitionerRole = extractBundleResources(bundle).PractitionerRole;
                const practitioner = extractBundleResources(bundle).Practitioner;

                return {
                    practitionerRole,
                    practitioner,
                };
            });

            if (isSuccess(response)) {
                const practitionerRoles = response.data.practitionerRole;
                const practitioners = response.data.practitioner;

                return practitionerRoles.map((resource) => {
                    const currentPractitioner = practitioners.find(
                        (practitioner) => getReference(practitioner).reference === resource.practitioner?.reference,
                    );

                    return {
                        value: resource.id,
                        label: renderHumanName(currentPractitioner?.name?.[0]),
                    };
                });
            }

            return [];
        },
        [selectedHealthcareService],
    );

    const resetFilter = () => {
        setSelectedHealthcareService(null);
        setSelectedPractitionerRole(null);
    };

    return {
        selectedHealthcareService,
        selectedPractitionerRole,
        healthcareServiceOptions,
        practitionerRoleOptions,
        onChange,
        resetFilter,
    };
}
