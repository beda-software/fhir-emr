import { t } from '@lingui/macro';
import { Empty, Result } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { WithId } from 'fhir-react';
import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { Patient } from 'fhir/r4b';

import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

import { usePatientWearablesData, WearablesDataRecord } from './hooks';

export interface PatientWearablesProps {
    patient: WithId<Patient>;
}

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
        render: (_text, resource) => (resource.duration !== undefined ? Math.round(resource.duration / 60) : undefined),
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
        render: (_text, resource) => (resource.energy !== undefined ? Math.round(resource.energy) : undefined),
    },
];

export function PatientWearables(props: PatientWearablesProps) {
    const [wearablesData] = usePatientWearablesData(props.patient);

    usePatientHeaderLocationTitle({ title: t`Wearables` });

    return (
        <Table<WearablesDataRecord>
            locale={{
                emptyText: (
                    <RenderRemoteData remoteData={wearablesData}>
                        {({ hasConsent }) => (
                            <>
                                {hasConsent ? (
                                    <Empty description={t`No data`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                ) : (
                                    <Result
                                        status="info"
                                        subTitle="Contact the patient to obtain their consent for accessing activity data"
                                        title="Patient consent is required"
                                    />
                                )}
                            </>
                        )}
                    </RenderRemoteData>
                ),
            }}
            rowKey={(p) => p.sid}
            dataSource={isSuccess(wearablesData) ? wearablesData.data.records : []}
            columns={columns}
            loading={isLoading(wearablesData) ? { indicator: SpinIndicator } : undefined}
        />
    );
}
