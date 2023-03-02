import { Trans } from '@lingui/macro';
import { Empty, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';

import { isLoading, isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';

import { SpinIndicator } from '../Spinner';
import { Table } from '../Table';
import s from './EncountersTable.module.scss';
import { EncounterData } from './types';

interface EncountersTableProps {
    columns: ColumnsType<EncounterData>;
    remoteData: RemoteData<EncounterData[]>;
    handleTableChange?: (pagination: TablePaginationConfig) => Promise<void>;
    pagination?: {
        current: number;
        pageSize: number;
        total: number | undefined;
    };
    onRowEnabled?: boolean;
}

export function EncountersTable(props: EncountersTableProps) {
    const encounterDataListRD = props.remoteData;

    const navigate = useNavigate();

    const onRow = (record: any) => {
        return {
            onClick: () => {
                navigate(`/patients/${record.patient?.id}/encounters/${record.id}`);
            },
        };
    };

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
            pagination={props.pagination}
            onChange={props.handleTableChange}
            rowKey={(record) => record.id}
            dataSource={isSuccess(encounterDataListRD) ? encounterDataListRD.data : []}
            columns={props.columns}
            loading={isLoading(encounterDataListRD) && { indicator: SpinIndicator }}
            onRow={props.onRowEnabled ? onRow : undefined}
            rowClassName={props.onRowEnabled ? s.row : undefined}
        />
    );
}
