import { Col } from 'antd';
import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources, getReference } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { renderHumanName } from 'shared/src/utils/fhir';

import { AsyncSelect } from 'src/components/Select';

import { useReferenceColumn } from './hooks';
import { OptionType } from './types';
import { SearchBarColumnReferenceTypeProps } from '../types';

const referenceColumnMapping = {
    healthcareService: {
        loadOptions: async (search: string) => {
            const response = mapSuccess(
                await getFHIRResources<HealthcareService>('HealthcareService', { 'service-type': search }),
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
    },
    practitionerRole: {
        loadOptions: async (search: string) => {
            const response = mapSuccess(
                await getFHIRResources<PractitionerRole | Practitioner>('PractitionerRole', {
                    name: search,
                    _include: ['PractitionerRole:practitioner:Practitioner'],
                }),
                (bundle) => {
                    const practitionerRole = extractBundleResources(bundle).PractitionerRole;
                    const practitioner = extractBundleResources(bundle).Practitioner;

                    return {
                        practitionerRole,
                        practitioner,
                    };
                },
            );

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
    },
};

export function ReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { onColumnChange } = useReferenceColumn(props);
    const { loadOptions } = referenceColumnMapping[props.columnFilterValue.column.id];

    return (
        <Col>
            <AsyncDropdown onChange={onColumnChange} loadOptions={loadOptions} />
        </Col>
    );
}

function AsyncDropdown({
    onChange,
    loadOptions,
}: {
    onChange: (selectedOption: OptionType | readonly OptionType[] | null) => void;
    loadOptions: (search: string) => void;
}) {
    const handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '');
        return inputValue;
    };

    return (
        <AsyncSelect
            classNamePrefix="react-select"
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onInputChange={handleInputChange}
            onChange={onChange}
        />
    );
}
