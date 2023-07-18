import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf/lib/types';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionBoolean } from './index';

const meta: Meta<typeof QuestionBoolean> = {
    title: 'widget/QuestionBoolean',
    component: QuestionBoolean,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionBoolean>;

export const Example: Story = {
    render: () => (
        <QuestionBoolean
            parentPath={[]}
            questionItem={{
                text: 'Boolean question',
                type: 'boolean',
                linkId: 'example',
                required: true,
            }}
            context={{} as ItemContext}
        />
    ),
};
