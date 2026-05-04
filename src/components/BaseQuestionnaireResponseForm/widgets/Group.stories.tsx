import type { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { Group } from '@beda.software/web-item-controls/controls';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

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
