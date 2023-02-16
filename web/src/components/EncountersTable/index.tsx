import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';

import { isLoading, isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';

import { SpinIndicator } from '../Spinner';
import { Table } from '../Table';
import { EncounterData } from './types';

interface EncountersTableProps {
    columns: ColumnsType<EncounterData>;
    remoteData: RemoteData<EncounterData[]>;
}

export function EncountersTable(props: EncountersTableProps) {
    const navigate = useNavigate();

    const encounterDataListRD = props.remoteData;

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
            dataSource={isSuccess(encounterDataListRD) ? encounterDataListRD.data : []}
            columns={props.columns}
            loading={isLoading(encounterDataListRD) && { indicator: SpinIndicator }}
        />
    );
}
