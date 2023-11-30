import { Row, Button } from 'antd';

import { AsyncDropdown } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect';
import {
    OptionType,
    SelectOption,
} from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect/types';

import { S } from './MedicationsSearchBar.styles';

export interface MedicationsSearchBarSelectProps {
    selectedMedication: SelectOption;
    loadMedicationOptions: (search: string) => void;
    onChangeMedication: (option: SelectOption) => void;
    reset: () => void;
}

export function MedicationsSearchBar(props: MedicationsSearchBarSelectProps) {
    const { onChangeMedication, loadMedicationOptions, selectedMedication, reset } = props;

    return (
        <S.Container>
            <Row gutter={[32, 16]}>
                <S.SelectContainer>
                    <AsyncDropdown
                        onChange={onChangeMedication}
                        loadOptions={loadMedicationOptions}
                        value={selectedMedication as OptionType}
                        placeholder="Medication"
                    />
                </S.SelectContainer>
            </Row>

            <Button onClick={reset}>Reset</Button>
        </S.Container>
    );
}
