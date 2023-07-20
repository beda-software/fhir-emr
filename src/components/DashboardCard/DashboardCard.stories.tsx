import { ContactsOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { DashboardCard, DashboardCardTable } from './index';

const meta: Meta<typeof DashboardCard> = {
    title: 'components / DashboardCard',
    component: DashboardCard,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof DashboardCard>;

export const Default: Story = {
    render: () => (
        <DashboardCard title="General Information" icon={<ContactsOutlined />}>
            <div style={{ padding: 16 }}>Card content</div>
        </DashboardCard>
    ),
};

export const WithExtra: Story = {
    render: () => (
        <DashboardCard
            title="General Information"
            icon={<ContactsOutlined />}
            extra={
                <Button type="link" style={{ fontWeight: 'bold' }}>
                    Edit
                </Button>
            }
        >
            <div style={{ padding: 16 }}>Card content</div>
        </DashboardCard>
    ),
};

export const WithTable: Story = {
    render: () => (
        <DashboardCard title="Allergies" icon={<ExperimentOutlined />}>
            <DashboardCardTable {...tableProps} />
        </DashboardCard>
    ),
};

export const Empty: Story = {
    render: () => (
        <DashboardCard title="Allergies" icon={<ExperimentOutlined />} empty>
            <DashboardCardTable {...tableProps} data={[]} />
        </DashboardCard>
    ),
};

const tableProps = {
    title: 'Allergies',
    getKey: (r: any) => r.key,
    data: [
        {
            key: 'Chocolate',
            name: 'Chocolate',
            date: '20/07/2021',
        },
        {
            key: 'Aspirin',
            name: 'Aspirin',
            date: '20/07/2020',
        },
    ],
    columns: [
        {
            title: 'Name',
            key: 'name',
            render: (r: any) => (
                <Button type="link" style={{ padding: 0 }}>
                    {r.name}
                </Button>
            ),
        },
        {
            title: 'Date',
            key: 'date',
            render: (r: any) => r.date,
            width: 120,
        },
    ],
};
