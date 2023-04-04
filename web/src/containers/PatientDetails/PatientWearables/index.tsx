import { t } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

import { usePatientWearablesData, WearablesDataRecord } from './hooks';

const columns: ColumnsType<WearablesDataRecord> = [
    {
        title: t`Activity`,
        dataIndex: 'activity',
        key: 'activity',
        render: (_text, resource) => resource.code,
    },
    {
        title: t`Duration (min)`,
        dataIndex: 'duration',
        key: 'duration',
        render: (_text, resource) =>
            resource.duration !== undefined ? Math.round(resource.duration / 60) : undefined,
    },
    {
        title: t`Start`,
        dataIndex: 'start',
        key: 'start',
        render: (_text, resource) => resource.start,
    },
    {
        title: t`End`,
        dataIndex: 'end',
        key: 'end',
        render: (_text, resource) => resource.finish,
    },
    {
        title: t`Calories`,
        dataIndex: 'calories',
        key: 'calories',
        render: (_text, resource) =>
            resource.energy !== undefined ? Math.round(resource.energy) : undefined,
    },
];

export function PatientWearables() {
    const [wearablesData] = usePatientWearablesData();

    usePatientHeaderLocationTitle({ title: t`Wearables` });

    return (
        <Table<WearablesDataRecord>
            locale={{
                emptyText: (
                    <>
                        <Empty description={t`No data`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </>
                ),
            }}
            rowKey={(p) => p.sid}
            dataSource={isSuccess(wearablesData) ? wearablesData.data : []}
            columns={columns}
            loading={isLoading(wearablesData) ? { indicator: SpinIndicator } : undefined}
        />
    );
}
