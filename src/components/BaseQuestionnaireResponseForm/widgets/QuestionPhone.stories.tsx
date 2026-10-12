import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { QuestionPhone } from '@beda.software/web-item-controls/controls';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

const meta: Meta<typeof QuestionPhone> = {
    title: 'Questionnaire / questions / phoneWidget',
    component: QuestionPhone,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionPhone>;

export const Example: Story = {
    render: () => (
        <QuestionPhone
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'string',
                linkId: 'example',
                required: true,
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Disabled: Story = {
    render: () => (
        <QuestionPhone
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
