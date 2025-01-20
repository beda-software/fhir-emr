import { CalendarOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { Meta, StoryObj } from '@storybook/react';
import { Button, Input } from 'antd';
import styled from 'styled-components';

import { Table } from 'src/components/Table';
import { Tabs } from 'src/components/Tabs';
import { Text } from 'src/components/Typography';
import { withColorSchemeDecorator } from 'src/storybook/decorators';

import { PageContainer, PageContainerProps } from './index';

const content = (
    <>
        <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In suscipit magna sed pretium maximus. Duis
            bibendum a lacus ut commodo. Nam eget justo tristique, tincidunt ligula vel, accumsan odio. Morbi purus
            ante, bibendum vitae arcu eget, ultrices faucibus dolor. Sed fermentum blandit malesuada. Duis fringilla ac
            tortor ut convallis. Fusce iaculis arcu dui. Ut non neque rhoncus, tincidunt ipsum in, lobortis magna. Donec
            aliquet leo tellus. Proin pulvinar lacus sodales tortor eleifend rhoncus. Praesent varius maximus pulvinar.
        </Text>
    </>
);

const table = (
    <Table
        bordered
        dataSource={[]}
        columns={[
            {
                title: 'Patient',
                dataIndex: 'patient',
                key: 'patient',
                width: '50%',
                render: () => '-',
            },
            {
                title: 'Practitioner',
                dataIndex: 'practitioner',
                key: 'practitioner',
                width: '50%',
                render: () => '-',
            },
        ]}
    />
);

const tabs = (
    <Tabs
        boxShadow={false}
        items={[
            {
                label: 'Tab',
                key: 'tab1',
            },
            {
                label: 'Tab',
                key: 'tab2',
            },
            {
                label: 'Tab',
                key: 'tab3',
            },
            {
                label: 'Tab',
                key: 'tab4',
            },
        ]}
        activeKey={'tab1'}
    />
);

const S = {
    Container: styled.div`
        background-color: ${({ theme }) => theme.neutralPalette.gray_2};
    `,
    CustomRightColumn: styled.div`
        display: flex;
        align-items: center;
        gap: 0 16px;
    `,
    Item: styled.div`
        display: flex;
        align-items: center;
        gap: 0 4px;
        color: ${({ theme }) => theme.neutral.secondaryText};
    `,
};

const rightColumn1 = (
    <S.CustomRightColumn>
        <S.Item>
            <CalendarOutlined />
            <Text>05/12/1955 • 66 y.o.</Text>
        </S.Item>
        <S.Item>
            <PhoneOutlined />
            <Text>+972-222-3333</Text>
        </S.Item>
        <S.Item>
            <MailOutlined />
            <Text>cooper@gmail.com</Text>
        </S.Item>
    </S.CustomRightColumn>
);

const rightColumn2 = (
    <>
        <Input.Search placeholder="Search by email or phone" style={{ width: 328 }} />
        <Button type="primary" icon={<PlusOutlined />}>
            Add patient
        </Button>
    </>
);

const meta: Meta<typeof PageContainer> = {
    title: 'Layout / PageContainer',
    component: PageContainer,
    // @ts-ignore
    decorators: [withColorSchemeDecorator],
    args: {
        title: 'Patients',
        children: content,
    },
    render: (args) => {
        return (
            <S.Container>
                <PageContainer {...args} />
            </S.Container>
        );
    },
};

export default meta;

type Story = StoryObj<PageContainerProps>;

export const Default: Story = {
    args: {
        title: 'Madison Cooper',
        titleRightElement: rightColumn1,
    },
};

export const WithTable: Story = {
    args: {
        layoutVariant: 'with-table',
        children: table,
        titleRightElement: rightColumn2,
    },
};

export const WithTabs: Story = {
    args: {
        layoutVariant: 'with-tabs',
        headerContent: tabs,
    },
};

export const FullWidth: Story = {
    args: {
        maxWidth: '100%',
    },
};

export const CustomWidth: Story = {
    args: {
        maxWidth: 500,
    },
};
