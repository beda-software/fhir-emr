import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, findByTestId } from '@storybook/testing-library';
import { ItemContext } from 'sdc-qrf/lib/types';

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
        await expect(questions.length > 0).toBe(true);
        const checkbox = await findByTestId<HTMLInputElement>(questions[0]!, 'checkbox');
        expect(checkbox.checked).toBe(false);

        await userEvent.click(checkbox);
        await expect(checkbox.checked).toBe(true);

        await userEvent.click(checkbox);
        await expect(checkbox.checked).toBe(false);
    },
};
