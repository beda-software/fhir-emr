import { t } from '@lingui/macro';
import { Button } from 'antd';

import { S } from 'src/components/SearchBar/styles';
import { AsyncDropdown } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect';
import { OptionType } from 'src/containers/OrganizationScheduling/HealthcareServicePractitionerSelect/types';
import { Role, matchCurrentUserRole } from 'src/utils/role';

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
        <S.SearchBar>
            <S.LeftColumn>
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
            </S.LeftColumn>

            <Button onClick={reset}>{t`Reset`}</Button>
        </S.SearchBar>
    );
}
