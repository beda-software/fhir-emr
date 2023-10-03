import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';
import { useCallback, useState } from 'react';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources, getReference } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { renderHumanName } from 'shared/src/utils/fhir';

import { MultiValue, OptionType, SingleValue } from './types';
import { SearchBarColumnReferenceTypeProps } from '../types';

export function useReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { onChange, columnFilterValue } = props;
    const [selectedHealthcareService, setSelectedHealthcareService] = useState<
        MultiValue<OptionType> | SingleValue<OptionType>
    >(null);
    const [selectedPractitionerRole, setSelectedPractitionerRole] = useState<
        MultiValue<OptionType> | SingleValue<OptionType>
    >(null);

    // TODO: Move it to
    const isSingleValue = (
        value: MultiValue<OptionType> | SingleValue<OptionType>,
    ): value is SingleValue<OptionType> => {
        return !Array.isArray(value);
    };

    const getSelectedValue = (selectedValue: MultiValue<OptionType> | SingleValue<OptionType>): string => {
        if (!selectedValue) {
            return '';
        }

        if (isSingleValue(selectedValue)) {
            return selectedValue.value;
        }

        return selectedValue?.[0]?.value ?? '';
    };

    const onColumnChange = useCallback(
        (selectedOption: MultiValue<OptionType> | SingleValue<OptionType>, type: 'healthcare' | 'practitioner') => {
            const combinedValue = {
                healthcareService: getSelectedValue(selectedHealthcareService),
                practitionerRole: getSelectedValue(selectedPractitionerRole),
            };

            if (type === 'healthcare') {
                setSelectedHealthcareService(selectedOption);
                combinedValue.healthcareService = getSelectedValue(selectedOption);
            } else if (type === 'practitioner') {
                setSelectedPractitionerRole(selectedOption);
                combinedValue.practitionerRole = getSelectedValue(selectedOption);
            }
            onChange(combinedValue, columnFilterValue.column.id);
        },
        [onChange, columnFilterValue, selectedHealthcareService, selectedPractitionerRole],
    );

    const healthcareServiceOptions = useCallback(
        async (search: string) => {
            const healthcareServicesResponse = selectedPractitionerRole
                ? await getFHIRResources<PractitionerRole | HealthcareService>('PractitionerRole', {
                      _id: getSelectedValue(selectedPractitionerRole),
                      _include: ['PractitionerRole:service:HealthcareService'],
                  })
                : await getFHIRResources<HealthcareService>('HealthcareService', { 'service-type': search });
            const response = mapSuccess(
                healthcareServicesResponse,
                (bundle) => extractBundleResources(bundle).HealthcareService,
            );

            if (isSuccess(response)) {
                return response.data.map((resource) => {
                    return {
                        value: resource.id,
                        label: resource.type?.[0]?.text,
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
                    'PractitionerRole:practitioner.name': search,
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

    return {
        onColumnChange,
        selectedHealthcareService,
        setSelectedHealthcareService,
        selectedPractitionerRole,
        setSelectedPractitionerRole,
        healthcareServiceOptions,
        practitionerRoleOptions,
        getSelectedValue,
    };
}
