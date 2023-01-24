import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType, TableProps } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';

import { WithId } from 'aidbox-react/lib/services/fhir';

import { Patient, Practitioner } from 'shared/src/contrib/aidbox';

import { Table } from '../Table';
import s from './EncountersTable.module.scss';

export interface EncounterData {
    id: string;
    patient?: WithId<Patient>;
    practitioner?: WithId<Practitioner>;
    status: string;
    date: string | undefined;
    humanReadableDate: string | undefined;
}

interface EncountersTableProps {
    columns: ColumnsType<EncounterData>;
    dataSource: TableProps<EncounterData>['dataSource'];
}

export function EncountersTable(props: EncountersTableProps) {
    const navigate = useNavigate();

    return (
        <Table<EncounterData>
            locale={{
                emptyText: (
                    <>
                        <Empty
                            description={<Trans>No data</Trans>}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </>
                ),
            }}
            rowKey={(record) => record.id}
            dataSource={props.dataSource}
            columns={props.columns}
            onRow={(record) => {
                return {
                    onClick: () => {
                        navigate(`/patients/${record.patient?.id}/encounters/${record.id}`);
                    },
                };
            }}
            rowClassName={s.row}
        />
    );
}
