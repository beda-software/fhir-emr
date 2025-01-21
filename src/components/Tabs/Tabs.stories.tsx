import { Meta, StoryObj } from '@storybook/react';

import { withColorSchemeDecorator } from 'src/storybook/decorators';

import { Tabs, TabsProps } from './index';

const args: TabsProps = {
    items: [
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
    ],
    activeKey: 'tab2',
};

const meta: Meta<TabsProps> = {
    title: 'components / Tabs',
    component: Tabs,
    decorators: [withColorSchemeDecorator],
    args,
};

export default meta;

type Story = StoryObj<TabsProps>;

export const Default: Story = {};

export const NoDivider: Story = {
    args: {
        boxShadow: false,
    },
};
