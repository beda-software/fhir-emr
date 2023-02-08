import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType, TableProps } from 'antd/lib/table';

import { Table } from '../Table';
import { EncounterData } from './types';

interface EncountersTableProps {
    columns: ColumnsType<EncounterData>;
    dataSource: TableProps<EncounterData>['dataSource'];
}

export function EncountersTable(props: EncountersTableProps) {
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
        />
    );
}
