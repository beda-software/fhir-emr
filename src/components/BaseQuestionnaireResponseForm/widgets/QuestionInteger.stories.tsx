import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { QuestionInteger } from '@beda.software/web-item-controls/controls';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

const meta: Meta<typeof QuestionInteger> = {
    title: 'Questionnaire / questions / integer',
    component: QuestionInteger,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionInteger>;

export const Example: Story = {
    render: () => (
        <QuestionInteger
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'string',
                linkId: 'example',
                required: true,
                helpText: 'Help text',
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Disabled: Story = {
    render: () => (
        <QuestionInteger
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'string',
                linkId: 'example',
                required: true,
                readOnly: true,
            }}
            context={{} as ItemContext}
        />
    ),
};
