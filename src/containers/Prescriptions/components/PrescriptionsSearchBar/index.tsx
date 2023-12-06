import { Row, Button } from 'antd';

import { AsyncDropdown } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect';
import {
    OptionType,
    SelectOption,
} from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect/types';
import { Role, matchCurrentUserRole } from 'src/utils/role';

import { S } from './PrescriptionsSearchBar.styles';

export interface PrescriptionsSearchBarSelectProps {
    selectedPatient: SelectOption;
    selectedPractitionerRole: SelectOption;
    selectedStatus: SelectOption;
    loadPatientOptions: (search: string) => void;
    loadPractitionerRoleOptions: (search: string) => void;
    loadStatusOptions: (search: string) => void;
    onChangePatient: (option: SelectOption) => void;
    onChangePractitionerRole: (option: SelectOption) => void;
    onChangeStatus: (option: SelectOption) => void;
    reset: () => void;
}

export function PrescriptionsSearchBar(props: PrescriptionsSearchBarSelectProps) {
    const {
        onChangePatient,
        loadPatientOptions,
        selectedPatient,
        onChangePractitionerRole,
        loadPractitionerRoleOptions,
        selectedPractitionerRole,
        onChangeStatus,
        loadStatusOptions,
        selectedStatus,
        reset,
    } = props;

    return (
        <S.Container>
            <Row gutter={[32, 16]}>
                <S.SelectContainer>
                    <AsyncDropdown
                        onChange={onChangePractitionerRole}
                        loadOptions={loadPractitionerRoleOptions}
                        value={selectedPractitionerRole as OptionType}
                        placeholder="Practitioner"
                    />
                    <AsyncDropdown
                        onChange={onChangePatient}
                        loadOptions={loadPatientOptions}
                        value={selectedPatient as OptionType}
                        placeholder="Patient"
                        hidden={matchCurrentUserRole({
                            [Role.Admin]: () => false,
                            [Role.Patient]: () => true,
                            [Role.Practitioner]: () => false,
                            [Role.Receptionist]: () => false,
                        })}
                    />
                    <AsyncDropdown
                        onChange={onChangeStatus}
                        loadOptions={loadStatusOptions}
                        value={selectedStatus as OptionType}
                        placeholder="Status"
                    />
                </S.SelectContainer>
            </Row>

            <Button onClick={reset}>Reset</Button>
        </S.Container>
    );
}
