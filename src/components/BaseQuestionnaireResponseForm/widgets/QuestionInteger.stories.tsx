import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionInteger } from './index';

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
            }}
            context={{} as ItemContext}
        />
    ),
};
