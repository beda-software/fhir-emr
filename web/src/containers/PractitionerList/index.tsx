import { t, Trans } from '@lingui/macro';
import { PageHeader, Button, Table, Input, Empty } from 'antd';

import { BaseLayout } from 'src/components/BaseLayout';
import { ModalNewPractitioner } from 'src/components/ModalNewPractitioner';

const dataSource = [
    {
        key: '1',
        fullname: 'Волыхов Андрей Александрович',
        specialty: 'Хирург',
        position: 'Заведующий отделением, практикующий врач',
        date: '12.12.2021',
    },
    {
        key: '2',
        fullname: 'Вассерман Анатолий Александрович',
        specialty: 'Оториноларинголог',
        position: 'Главный врач, практикующий врач',
        date: '12.12.2021',
    },
];

const columns = [
    {
        title: <Trans>Fullname</Trans>,
        dataIndex: 'fullname',
        key: 'fullname',
        width: '35%',
    },
    {
        title: <Trans>Speciality</Trans>,
        dataIndex: 'specialty',
        key: 'specialty',
        width: '20%',
    },
    {
        title: <Trans>Position</Trans>,
        dataIndex: 'position',
        key: 'position',
        width: '25%',
    },
    {
        title: <Trans>Appointment date</Trans>,
        dataIndex: 'date',
        key: 'date',
    },
];

export function PractitionerList() {
    return (
        <BaseLayout bgHeight={281}>
            <PageHeader title={t`Practitioners`} extra={[<ModalNewPractitioner />]} />
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
                <Input.Search placeholder={t`Search by name`} style={{ width: 264 }} />
                <Button>
                    <Trans>Reset</Trans>
                </Button>
            </div>
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
                dataSource={dataSource}
                columns={columns}
            />
        </BaseLayout>
    );
}
