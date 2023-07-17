import type { Meta, StoryObj } from '@storybook/react';

import { QuestionChoice } from './index';
import { StoryQuestionDecorator } from './utils-stories';

const meta: Meta<typeof QuestionChoice> = {
    title: 'widget/QuestionChoice',
    component: QuestionChoice,
    decorators: [
        (Story) => (
            <StoryQuestionDecorator>
                <Story />
            </StoryQuestionDecorator>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof QuestionChoice>;

export const Example: Story = {
    render: () => (
        <QuestionChoice
            parentPath={[]}
            questionItem={{
                text: 'Select from list',
                type: 'choice',
                linkId: 'example',
                required: true,
                answerOption: [
                    { value: { Coding: { code: '1', display: 'Item 1' } } },
                    { value: { Coding: { code: '2', display: 'Item 2' } } },
                    { value: { Coding: { code: '3', display: 'Item 3' } } },
                    { value: { Coding: { code: '4', display: 'Item 4' } } },
                ],
            }}
            context={{} as any}
        />
    ),
};
