import { PlusOutlined } from '@ant-design/icons';
import { PageHeader, Button, Table, Input } from 'antd';

import { BaseLayout } from 'src/components/BaseLayout';

const dataSource = [
    {
        key: '1',
        fullname: 'Волыхов Андрей Александрович',
        specialty: 'Хирург',
        position: 'Заведующий отделением, практикующий врач',
        date: '12.12.2021'
    },
    {
        key: '2',
        fullname: 'Вассерман Анатолий Александрович',
        specialty: 'Оториноларинголог',
        position: 'Главный врач, практикующий врач',
        date: '12.12.2021'
    },
];

const columns = [
    {
        title: 'ФИО',
        dataIndex: 'fullname',
        key: 'fullname',
        width: '35%'
    },
    {
        title: 'Специальность',
        dataIndex: 'specialty',
        key: 'specialty',
        width: '20%'
    },
    {
        title: 'Должность',
        dataIndex: 'position',
        key: 'position',
        width: '25%'
    },
    {
        title: 'Дата приема',
        dataIndex: 'date',
        key: 'date',
    },
];

export function PractitionerList() {
    return (
        <BaseLayout bgHeight={281}>
            <PageHeader
                title="Врачи"
                extra={[
                    <Button icon={<PlusOutlined />} type="primary">
                        Новый врач
                    </Button>,
                ]}
            />
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
                <Input.Search placeholder="Поиск по имени" style={{ width: 264 }} />
                <Button>Сбросить</Button>
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </BaseLayout>
    );
}
