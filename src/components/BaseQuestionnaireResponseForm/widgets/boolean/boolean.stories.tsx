import { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, findByTestId } from '@storybook/test';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionBoolean } from './index';

const meta: Meta<typeof QuestionBoolean> = {
    title: 'Questionnaire / questions / boolean',
    component: QuestionBoolean,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionBoolean>;

export const Default: Story = {
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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const getQuestion = () => canvas.findAllByTestId('question-boolean');

        const questions: HTMLElement[] = await getQuestion();
        expect(questions.length > 0).toBe(true);
        const checkbox = await findByTestId<HTMLInputElement>(questions[0]!, 'checkbox');
        expect(checkbox).not.toBeChecked();

        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();

        await userEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    },
};
