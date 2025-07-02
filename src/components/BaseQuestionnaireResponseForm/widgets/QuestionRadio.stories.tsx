import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionSolidRadio } from './index';

const meta: Meta<typeof QuestionSolidRadio> = {
    title: 'Questionnaire / questions / solid-radio-button',
    component: QuestionSolidRadio,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionSolidRadio>;

export const SingleLine: Story = {
    render: () => (
        <QuestionSolidRadio
            parentPath={[]}
            questionItem={{
                text: 'Select from list',
                type: 'string',
                linkId: 'example',
                required: true,
                answerOption: [
                    { valueCoding: { code: '1', display: 'Item 1' } },
                    { valueCoding: { code: '2', display: 'Item 2' } },
                    { valueCoding: { code: '3', display: 'Item 3' } },
                    { valueCoding: { code: '4', display: 'Item 4' } },
                ],
            }}
            context={{} as ItemContext}
        />
    ),
};

export const RightOption: Story = {
    render: () => (
        <QuestionSolidRadio
            parentPath={[]}
            questionItem={{
                text: 'Select from list',
                type: 'string',
                linkId: 'example',
                required: true,
                adjustLastToRight: true,
                answerOption: [
                    { valueCoding: { code: '1', display: 'Item 1' } },
                    { valueCoding: { code: '2', display: 'Item 2' } },
                    { valueCoding: { code: '3', display: 'Item 3' } },
                    { valueCoding: { code: '4', display: 'Item 4' } },
                    { valueCoding: { code: '0', display: 'None' } },
                ],
            }}
            context={{} as ItemContext}
        />
    ),
};
