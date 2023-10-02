import { Col } from 'antd';
import { HealthcareService } from 'fhir/r4b';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { AsyncSelect } from 'src/components/Select';

import { useReferenceColumn } from './hooks';
import { OptionType } from './types';
import { SearchBarColumnReferenceTypeProps } from '../types';

export function ReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { onColumnChange } = useReferenceColumn(props);

    return (
        <Col>
            <AsyncDropdown onChange={onColumnChange} />
        </Col>
    );
}

function AsyncDropdown({
    onChange,
}: {
    onChange: (selectedOption: OptionType | readonly OptionType[] | null) => void;
}) {
    const handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '');
        return inputValue;
    };

    const loadOptions = async (search: string) => {
        const response = mapSuccess(
            await getFHIRResources<HealthcareService>('HealthcareService', { name: search }),
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
    };

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onInputChange={handleInputChange}
            onChange={onChange}
        />
    );
}
