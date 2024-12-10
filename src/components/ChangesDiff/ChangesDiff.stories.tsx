import { Meta, StoryObj } from '@storybook/react';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { ChangesDiff, ChangesDiffProps } from './index';

const meta: Meta<typeof ChangesDiff> = {
    title: 'components / ChangesDiff',
    component: ChangesDiff,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof ChangesDiff>;

export const Additions: Story = {
    render: () => <ChangesDiff {...props1} />,
};

export const Deletions: Story = {
    render: () => <ChangesDiff {...props2} />,
};

const props1: ChangesDiffProps = {
    id: '6d2d6fe6-beba-4ce6-9a9f-dd0d4b06d4e5',
    activityCode: 'CREATE',
    recorded: '2023-07-19T14:16:19.825125Z',
    author: ['Alex Admin'],
    changes: [
        {
            valueBefore: null,
            valueAfter: 'Food',
            title: 'Type',
            key: 'type',
        },
        {
            valueBefore: null,
            valueAfter: 'Anaphylaxis, Headache',
            title: 'Reaction',
            key: 'reaction',
        },
        {
            valueBefore: null,
            valueAfter: 'Strawberry',
            title: 'Substance',
            key: 'substance-food',
        },
    ],
};

const props2: ChangesDiffProps = {
    id: '27613e5f-e8dd-4a9c-8d36-dfd2f1089d5e',
    activityCode: 'UPDATE',
    recorded: '2023-07-19T14:16:19.825125Z',
    author: ['Alex Admin'],
    changes: [
        {
            valueBefore: 'Anaphylaxis, Headache',
            valueAfter: 'Headache, Nausea',
            title: 'Reaction',
            key: 'reaction',
        },
        {
            valueBefore: 'Strawberry',
            valueAfter: 'Chocolate',
            title: 'Substance',
            key: 'substance-food',
        },
        {
            valueBefore: null,
            valueAfter: 'Note1',
            title: 'Notes',
            key: 'notes',
        },
    ],
};
