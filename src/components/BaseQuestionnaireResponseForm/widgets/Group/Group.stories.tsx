import type { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { Group } from './index';

const meta: Meta<typeof Group> = {
    title: 'Questionnaire / questions / group',
    component: Group,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof Group>;

export const Example: Story = {
    render: () => (
        <Group
            parentPath={[]}
            questionItem={{
                text: 'Group Title',
                type: 'group',
                linkId: 'example',
                required: true,
            }}
            context={[] as ItemContext[]}
        />
    ),
};
