import { t } from '@lingui/macro';
import { Alert, Empty, Result } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Patient } from 'fhir/r4b';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';
import { isFailure, isLoading } from '@beda.software/remote-data';

import { SpinIndicator, Spinner } from 'src/components/Spinner';
import { Table } from 'src/components/Table';

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

    if (isFailure(wearablesData)) {
        console.log('status', wearablesData.status);
        console.log('error', wearablesData.error);
    }

    return (
        <RenderRemoteData
            remoteData={wearablesData}
            renderLoading={Spinner}
            renderFailure={(e) => <RenderError error={e} />}
        >
            {(data) => (
                <>
                    {data.patientRecordsWarning ? (
                        <Alert message={data.patientRecordsWarning.message} type="warning" />
                    ) : null}
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
                                    subTitle={t`Contact the patient to obtain their consent for accessing activity data`}
                                    title={t`Patient consent is required`}
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

function RenderError(error: any) {
    const errorTextMapping = {
        '403': t`You currently lack access to the patient's data. To obtain it, you must secure the patient's signed consent authorizing the release of their activity data.`,
        '401': t`To obtain this information, you need to authorize your account in the mobile application and link it with your health data providers.`,
    };
    const errorText = errorTextMapping[error.error?.status] ?? error.error?.message;

    return <Empty description={<span>{errorText}</span>} />;
}
