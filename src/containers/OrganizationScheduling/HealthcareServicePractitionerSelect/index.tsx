import { Col } from 'antd';

import { AsyncSelect } from 'src/components/Select';

import { S } from './HealthcareServicePractitionerSelect.styles';
import { AsyncDropdownProps, HealthcareServicePractitionerSelectProps, OptionType } from './types';
import { getSelectedValue } from '../utils';

export function HealthcareServicePractitionerSelect(props: HealthcareServicePractitionerSelectProps) {
    const {
        selectedHealthcareService,
        selectedPractitionerRole,
        loadHealthcareServiceOptions,
        loadPractitionerRoleOptions,
        onChangeHealthcareService,
        onChangePractitionerRole,
    } = props;

    return (
        <Col>
            <S.Container>
                <AsyncDropdown
                    key={
                        selectedPractitionerRole
                            ? getSelectedValue(selectedPractitionerRole)
                            : 'initial-healthcareservice-select'
                    }
                    onChange={onChangeHealthcareService}
                    loadOptions={loadHealthcareServiceOptions}
                    value={selectedHealthcareService as OptionType}
                />
                <AsyncDropdown
                    key={
                        selectedHealthcareService
                            ? getSelectedValue(selectedHealthcareService)
                            : 'initial-practitionerrole-select'
                    }
                    onChange={onChangePractitionerRole}
                    loadOptions={loadPractitionerRoleOptions}
                    value={selectedPractitionerRole as OptionType}
                />
            </S.Container>
        </Col>
    );
}

export function AsyncDropdown(props: AsyncDropdownProps) {
    const { onChange, loadOptions, value, placeholder, hidden } = props;

    if (hidden) {
        return null;
    }

    return (
        <AsyncSelect
            value={value}
            loadOptions={loadOptions}
            defaultOptions
            onChange={onChange}
            cacheOptions={false}
            maxMenuHeight={90}
            placeholder={placeholder}
            isClearable
        />
    );
}
