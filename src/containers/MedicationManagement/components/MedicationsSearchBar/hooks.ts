import { MedicationKnowledge } from 'fhir/r4b';
import { useCallback, useState } from 'react';

import { extractBundleResources } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { SelectOption } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect/types';
import { getSelectedValue } from 'src/containers/OrganizationScheduling/utils';
import { getFHIRResources } from 'src/services/fhir';

export function useMedicationsSearchBarSelect() {
    const [selectedMedication, setSelectedMedication] = useState<SelectOption>(null);

    const onChange = useCallback(
        (selectedOption: SelectOption, type: 'medication') => {
            const combinedValue = {
                medication: getSelectedValue(selectedMedication),
            };

            if (type === 'medication') {
                setSelectedMedication(selectedOption);
                combinedValue.medication = getSelectedValue(selectedOption);
            }
        },
        [selectedMedication, setSelectedMedication],
    );

    const medicationOptions = useCallback(async (search: string) => {
        const patientResponse = await getFHIRResources<MedicationKnowledge>('MedicationKnowledge', {
            code: search,
        });
        const response = mapSuccess(patientResponse, (bundle) => extractBundleResources(bundle).MedicationKnowledge);

        if (isSuccess(response)) {
            return response.data.map((resource) => {
                return {
                    value: resource.code?.coding?.[0]?.code,
                    label: resource.code?.coding?.[0]?.display,
                };
            });
        }

        return [];
    }, []);

    const resetFilter = () => {
        setSelectedMedication(null);
    };

    return {
        selectedMedication,
        medicationOptions,
        onChange,
        resetFilter,
    };
}
