import { t } from '@lingui/macro';
import { Row, Button } from 'antd';

import { AsyncDropdown } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect';
import { OptionType } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect/types';
import { Role, matchCurrentUserRole } from 'src/utils/role';

import { S } from './InvoiceListSearchBar.styles';
import { InvoiceListSearchBarSelectProps } from '../../types';

export function InvoiceListSearchBar(props: InvoiceListSearchBarSelectProps) {
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
                        placeholder={t`Practitioner`}
                    />
                    <AsyncDropdown
                        onChange={onChangePatient}
                        loadOptions={loadPatientOptions}
                        value={selectedPatient as OptionType}
                        placeholder={t`Patient`}
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
                        placeholder={t`Status`}
                    />
                </S.SelectContainer>
            </Row>

            <Button onClick={reset}>{t`Reset`}</Button>
        </S.Container>
    );
}
