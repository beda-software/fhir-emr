import { Col } from 'antd';

import { AsyncSelect } from 'src/components/Select';

import { useReferenceColumn } from './hooks';
import { S } from './ReferenceColumn.styles';
import { OptionType } from './types';
import { SearchBarColumnReferenceTypeProps } from '../types';

export function ReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const {
        onColumnChange,
        selectedHealthcareService,
        selectedPractitionerRole,
        healthcareServiceOptions,
        practitionerRoleOptions,
        getSelectedValue,
    } = useReferenceColumn(props);
    return (
        <Col>
            <S.Container>
                <AsyncDropdown
                    key={
                        selectedPractitionerRole
                            ? getSelectedValue(selectedPractitionerRole)
                            : 'initial-healthcareservice-select'
                    }
                    onChange={(option) => {
                        onColumnChange(option, 'healthcare');
                    }}
                    loadOptions={healthcareServiceOptions}
                    value={selectedHealthcareService as OptionType}
                />
                <AsyncDropdown
                    key={
                        selectedHealthcareService
                            ? getSelectedValue(selectedHealthcareService)
                            : 'initial-practitionerrole-select'
                    }
                    onChange={(option) => {
                        onColumnChange(option, 'practitioner');
                    }}
                    loadOptions={practitionerRoleOptions}
                    value={selectedPractitionerRole as OptionType}
                />
            </S.Container>
        </Col>
    );
}

function AsyncDropdown({
    onChange,
    loadOptions,
    value,
}: {
    onChange: (selectedOption: OptionType | readonly OptionType[] | null) => void;
    loadOptions: (search: string) => void;
    value?: OptionType;
}) {
    return (
        <S.SelectWrapper>
            <AsyncSelect
                value={value}
                loadOptions={loadOptions}
                defaultOptions
                onChange={onChange}
                cacheOptions={false}
                isClearable
            />
        </S.SelectWrapper>
    );
}
