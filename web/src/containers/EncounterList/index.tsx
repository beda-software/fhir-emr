import { t, Trans } from '@lingui/macro';
import { Button, DatePicker, Empty, Input, PageHeader, Table } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseLayout, BasePageContent, BasePageHeader } from 'src/components/BaseLayout';

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
    const navigate = useNavigate();

    const { encounterDataListRD } = useEncounterList({});

    return (
        <BaseLayout>
            <BasePageHeader style={{ padding: '0 0 92px' }}>
                <PageHeader title={t`Encounters`} />
                <div
                    style={{
                        position: 'relative',
                        padding: 16,
                        height: 64,
                        borderRadius: 10,
                        backgroundColor: '#C0D4FF',
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
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px' }}>
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
                                            navigate(`/encounters/${record.key}`);
                                        },
                                    };
                                }}
                            />
                        );
                    }}
                </RenderRemoteData>
            </BasePageContent>
        </BaseLayout>
    );
}
