import { t } from '@lingui/macro';
import { Alert, Empty, Result } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Patient } from 'fhir/r4b';
import { WithId } from 'fhir-react';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isFailure, isLoading } from 'fhir-react/lib/libs/remoteData';

import { SpinIndicator, Spinner } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { usePatientHeaderLocationTitle } from 'src/containers/PatientDetails/PatientHeader/hooks';

import { usePatientWearablesData, WearablesDataRecord } from './hooks';

export interface PatientWearablesProps {
    patient: WithId<Patient>;
}

function getColumns(): ColumnsType<WearablesDataRecord> {
    return [
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
            render: (_text, resource) => (resource.energy !== undefined ? Math.round(resource.energy) : undefined),
        },
        {
            title: t`Provider`,
            dataIndex: 'provider',
            key: 'provider',
            render: (_text, resource) => resource.provider,
        },
    ];
}

export function PatientWearables(props: PatientWearablesProps) {
    const [wearablesData] = usePatientWearablesData(props.patient);

    usePatientHeaderLocationTitle({ title: t`Wearables` });

    if (isFailure(wearablesData)) {
        console.log(wearablesData.status, wearablesData.error);
    }

    return (
        <RenderRemoteData remoteData={wearablesData} renderLoading={Spinner} renderFailure={() => <></>}>
            {(data) => (
                <>
                    {data.patientRecordsWarning ? <Alert message={data.patientRecordsWarning} type="warning" /> : null}
                    {data.patientMetriportRecordsWarning ? (
                        <Alert message={data.patientMetriportRecordsWarning} type="warning" />
                    ) : null}
                    <Table<WearablesDataRecord>
                        locale={{
                            emptyText: data.hasConsent ? (
                                <Empty description={t`No data`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            ) : (
                                <Result
                                    status="info"
                                    subTitle="Contact the patient to obtain their consent for accessing activity data"
                                    title="Patient consent is required"
                                />
                            ),
                        }}
                        rowKey={(p) => p.sid}
                        dataSource={data.aggregatedRecords}
                        columns={getColumns()}
                        loading={isLoading(wearablesData) ? { indicator: SpinIndicator } : undefined}
                    />
                </>
            )}
        </RenderRemoteData>
    );
}
