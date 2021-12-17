import { DatePicker, PageHeader, Button, Table, Input } from 'antd';

import { BaseLayout } from 'src/components/BaseLayout';

const dataSource = [
    {
        key: '1',
        patient: 'Волыхов Андрей Александрович',
        encounter: 'Волыхов Андрей Александрович',
        status: 'запланирован',
        date: '12.12.2021',
    },
    {
        key: '2',
        patient: 'Волыхов Андрей Александрович',
        encounter: 'Волыхов Андрей Александрович',
        status: 'запланирован',
        date: '12.12.2021',
    },
];

const columns = [
    {
        title: 'Пациент',
        dataIndex: 'patient',
        key: 'patient',
    },
    {
        title: 'Врач',
        dataIndex: 'encounter',
        key: 'encounter',
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
            <Table dataSource={dataSource} columns={columns} />
        </BaseLayout>
    );
}
