import { DatePicker, PageHeader, Button, Table, Input } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseLayout } from 'src/components/BaseLayout';

import { useEncounterList } from './hooks';

const columns = [
    {
        title: 'Пациент',
        dataIndex: 'patient',
        key: 'patient',
    },
    {
        title: 'Врач',
        dataIndex: 'practitioner',
        key: 'practitioner',
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Дата приема',
        dataIndex: 'date',
        key: 'date',
    },
];

const { RangePicker } = DatePicker;

export function EncounterList() {
    const navigate = useNavigate();

    const encounterDataListRD = useEncounterList({});

    return (
        <BaseLayout bgHeight={281}>
            <PageHeader title="Приемы" />
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
                <Input.Search placeholder="Поиск по пациенту" style={{ width: 264 }} />
                <Input.Search placeholder="Поиск по врачу" style={{ width: 264 }} />
                <RangePicker />
                <Button type="primary">Сбросить</Button>
            </div>
            <RenderRemoteData remoteData={encounterDataListRD}>
                {(tableData) => (
                    <Table
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
                )}
            </RenderRemoteData>
        </BaseLayout>
    );
}
