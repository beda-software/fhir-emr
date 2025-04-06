import { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from '@storybook/test';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionChoice } from './index';

const meta: Meta<typeof QuestionChoice> = {
    title: 'Questionnaire / questions / choice',
    component: QuestionChoice,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionChoice>;

export const Default: Story = {
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
                entryFormat: 'Select...',
            }}
            context={{} as ItemContext}
        />
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const getQuestion = () => canvas.findAllByText('Select...');

        const questions: HTMLElement[] = await getQuestion();
        await expect(questions.length > 0).toBe(true);

        // Choose Item 2 from the list
        await userEvent.click(questions[0]!);
        const item1 = await canvas.findByText('Item 1');
        const item2 = await canvas.findByText('Item 2');
        await expect(item1).toBeInTheDocument();

        await userEvent.click(item2);
        await expect(item1).not.toBeInTheDocument();

        // Item 2 was chosen
        const values = await canvas.findAllByText('Item 2');
        await expect(values.length > 0).toBe(true);
    },
};

export const Multiple: Story = {
    render: () => (
        <QuestionChoice
            parentPath={[]}
            questionItem={{
                text: 'Select from list',
                type: 'choice',
                linkId: 'example',
                repeats: true,
                required: true,
                answerOption: [
                    { value: { Coding: { code: '1', display: 'Item 1' } } },
                    { value: { Coding: { code: '2', display: 'Item 2' } } },
                    { value: { Coding: { code: '3', display: 'Item 3' } } },
                    { value: { Coding: { code: '4', display: 'Item 4' } } },
                ],
                entryFormat: 'Select...',
            }}
            context={{} as ItemContext}
        />
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const getQuestion1 = () => canvas.findAllByText('Select...');

        const questions1: HTMLElement[] = await getQuestion1();
        await expect(questions1.length > 0).toBe(true);

        // Choose Item 2 from the list
        await userEvent.click(questions1[0]!);
        const item1 = await canvas.findByText('Item 1');
        const item2 = await canvas.findByText('Item 2');
        await expect(item1).toBeInTheDocument();

        await userEvent.click(item2);
        await expect(item1).not.toBeInTheDocument();

        const values = await canvas.findAllByText('Item 2');
        await expect(values.length > 0).toBe(true);

        // Choose Item 3 from the list
        const getQuestion2 = () => canvas.findAllByText('Item 2');
        const questions2: HTMLElement[] = await getQuestion2();
        await expect(questions2.length > 0).toBe(true);

        await userEvent.click(questions2[0]!);
        const item3 = await canvas.findByText('Item 3');
        await expect(item3).toBeInTheDocument();

        await userEvent.click(item3);
        await expect(item1).not.toBeInTheDocument();

        // Item 2 and Item 3 were chosen
        const item2values = await canvas.findAllByText('Item 2');
        const item3values = await canvas.findAllByText('Item 3');
        await expect(item2values.length > 0).toBe(true);
        await expect(item3values.length > 0).toBe(true);

        // Remove Item 3
        const removeButtons = await canvas.findAllByRole('button', { name: 'Remove Item 3' });
        await userEvent.click(removeButtons[1]!);

        item3values.forEach(async (i) => await expect(i).not.toBeInTheDocument());
    },
};
