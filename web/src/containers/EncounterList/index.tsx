import { t, Trans } from '@lingui/macro';
import { DatePicker, PageHeader, Button, Table, Input, Empty } from 'antd';
import { useHistory } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseLayout } from 'src/components/BaseLayout';

import { useEncounterList } from './hooks';

const columns = [
    {
        title: <Trans>Patient</Trans>,
        dataIndex: 'patient',
        key: 'patient',
    },
    {
        title: <Trans>Practitioner</Trans>,
        dataIndex: 'practitioner',
        key: 'practitioner',
    },
    {
        title: <Trans>Status</Trans>,
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: <Trans>Appointment date</Trans>,
        dataIndex: 'date',
        key: 'date',
    },
];

const { RangePicker } = DatePicker;

export function EncounterList() {
    const history = useHistory();

    const encounterDataListRD = useEncounterList({});

    return (
        <BaseLayout bgHeight={281}>
            <PageHeader title={t`Encounters`} />
            <div
                style={{
                    position: 'relative',
                    padding: 16,
                    height: 64,
                    borderRadius: 10,
                    backgroundColor: '#C0D4FF',
                    marginBottom: 36,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Input.Search placeholder={t`Search by patient`} style={{ width: 264 }} />
                <Input.Search placeholder={t`Search by practitioner`} style={{ width: 264 }} />

                <RangePicker placeholder={[t`Start date`, t`End date`]} />

                <Button type="primary">
                    <Trans>Reset</Trans>
                </Button>
            </div>
            <RenderRemoteData remoteData={encounterDataListRD}>
                {(tableData) => {
                    return (
                        <Table
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
                            dataSource={tableData}
                            columns={columns}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        history.push(`/encounters/${record.key}`);
                                    },
                                };
                            }}
                        />
                    );
                }}
            </RenderRemoteData>
        </BaseLayout>
    );
}
