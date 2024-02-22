import { Select } from 'antd';
import { Patient } from 'fhir/r4b';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { Option } from 'src/components/ResourceTable';

import { getOptions } from './utils';

interface Props {
    patient: WithId<Patient>;
}

export function PatientResources(props: Props) {
    const { patient } = props;
    const params = useParams<{ type: string }>();
    const type = params.type;
    const options = getOptions(patient);
    const [option, setOption] = useState<Option | undefined>(type ? options.find((o) => o.value === type) : options[0]);

    return (
        <>
            <Select
                defaultValue={type || options[0]?.value}
                style={{ width: 400 }}
                onChange={(v, o) => setOption(o as Option)}
                options={options}
            />
            {option?.renderTable(option)}
        </>
    );
}
