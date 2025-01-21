import { t } from '@lingui/macro';
import { Button } from 'antd';

import { S } from 'src/components/SearchBar/styles';
import { AsyncDropdown } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect';
import {
    OptionType,
    SelectOption,
} from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect/types';

export interface MedicationsSearchBarSelectProps {
    selectedMedication: SelectOption;
    loadMedicationOptions: (search: string) => void;
    onChangeMedication: (option: SelectOption) => void;
    reset: () => void;
}

export function MedicationsSearchBar(props: MedicationsSearchBarSelectProps) {
    const { onChangeMedication, loadMedicationOptions, selectedMedication, reset } = props;

    return (
        <S.SearchBar>
            <S.LeftColumn>
                <AsyncDropdown
                    onChange={onChangeMedication}
                    loadOptions={loadMedicationOptions}
                    value={selectedMedication as OptionType}
                    placeholder={t`Medication`}
                />
            </S.LeftColumn>

            <Button onClick={reset}>{t`Reset`}</Button>
        </S.SearchBar>
    );
}
