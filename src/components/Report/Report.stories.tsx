import { InfoCircleOutlined } from '@ant-design/icons';
import { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

import { withColorSchemeDecorator } from 'src/storybook/decorators';

import { Report, ReportLabel, ReportProps } from './index';

const args: ReportProps = {
    items: [
        {
            title: 'Title 1',
            value: 'Value 1',
        },
        {
            title: 'Title 2',
            value: 0,
        },
    ],
};

const meta: Meta<typeof Report> = {
    title: 'components / Report',
    component: Report,
    decorators: [withColorSchemeDecorator],
    args,
};

export default meta;

type Story = StoryObj<ReportProps>;

export const Default: Story = {};

const S = {
    Label: styled.div`
        display: flex;
        gap: 0 4px;
        color: ${({ theme }) => theme.neutralPalette.gray_7};

        svg {
            font-size: 14px;
        }
    `,
};

export const FullWidth: Story = {
    args: {
        fullWidth: true,
        items: [
            {
                title: 'Title 1',
                value: 'Value 1',
            },
            {
                title: 'Title 2',
                value: 0,
            },
            {
                title: (
                    <S.Label>
                        <ReportLabel>Title 3</ReportLabel>
                        <InfoCircleOutlined />
                    </S.Label>
                ),
                value: 'Value 3',
            },
            {
                title: 'Title 4',
                value: 'Value 4',
            },
        ],
    },
};
