import { PlusOutlined } from '@ant-design/icons';
import { PageHeader, Button, Table, Input } from 'antd';

import { BaseLayout } from 'src/components/BaseLayout';

const dataSource = [
    {
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
    },
    {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
    },
];

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

export function PatientList() {
    return (
        <BaseLayout bgHeight={281}>
            <PageHeader
                title="Пациенты"
                extra={[
                    <Button icon={<PlusOutlined />} type="primary">
                        Новый пациент
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
                <Input.Search placeholder="Найти пациента" style={{ width: 264 }} />
                <Button>Сбросить</Button>
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </BaseLayout>
    );
}
