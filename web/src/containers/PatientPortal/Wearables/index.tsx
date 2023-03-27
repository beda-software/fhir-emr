import { Trans } from '@lingui/macro';
import { Col, Empty, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { ColumnsType } from 'antd/lib/table';

import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';

import { usePatientWearablesData, WearablesDataRecord } from './hooks';
import s from './Wearables.module.scss';

const columns: ColumnsType<WearablesDataRecord> = [
    {
        title: <Trans id="msg.Wearables.Activity">Activity</Trans>,
        dataIndex: 'activity',
        key: 'activity',
        render: (_text, resource) => resource.code,
    },
    {
        title: <Trans id="msg.Wearables.Duration">Duration (min)</Trans>,
        dataIndex: 'duration',
        key: 'duration',
        render: (_text, resource) =>
            resource.duration !== undefined ? Math.round(resource.duration / 60) : undefined,
    },
    {
        title: <Trans id="msg.Wearables.Start">Start</Trans>,
        dataIndex: 'start',
        key: 'start',
        render: (_text, resource) => resource.start,
    },
    {
        title: <Trans id="msg.Wearables.End">End</Trans>,
        dataIndex: 'end',
        key: 'end',
        render: (_text, resource) => resource.finish,
    },
    {
        title: <Trans id="msg.Wearables.Calories">Calories</Trans>,
        dataIndex: 'calories',
        key: 'calories',
        render: (_text, resource) =>
            resource.energy !== undefined ? Math.round(resource.energy) : undefined,
    },
];

export function Wearables() {
    const [wearablesData] = usePatientWearablesData();

    return (
        <>
            <BasePageHeader className={s.basePageHeader}>
                <Row justify="space-between" align="middle" className={s.basePageHeaderRow}>
                    <Col>
                        <Title className={s.basePageHeaderTitle}>
                            <Trans>Wearables</Trans>
                        </Title>
                    </Col>
                </Row>
            </BasePageHeader>
            <BasePageContent className={s.basePageContent}>
                <Table<WearablesDataRecord>
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
                    rowKey={(p) => p.sid}
                    dataSource={isSuccess(wearablesData) ? wearablesData.data : []}
                    columns={columns}
                    loading={isLoading(wearablesData) ? { indicator: SpinIndicator } : undefined}
                />
            </BasePageContent>
        </>
    );
}
