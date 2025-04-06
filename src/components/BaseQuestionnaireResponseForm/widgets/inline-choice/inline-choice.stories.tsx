import { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, findByTestId } from '@storybook/test';
import { ItemContext } from 'sdc-qrf';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { InlineChoice } from './index';

const meta: Meta<typeof InlineChoice> = {
    title: 'Questionnaire / questions / inline-choice',
    component: InlineChoice,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof InlineChoice>;

export const Default: Story = {
    render: () => <InlineChoice parentPath={[]} questionItem={questionItemDefault} context={{} as ItemContext} />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const getQuestion = () => canvas.findAllByTestId('type');

        const questions: HTMLElement[] = await getQuestion();
        expect(questions.length > 0).toBe(true);

        // Choose an item in the list
        const checkbox1 = await findByTestId<HTMLInputElement>(questions[0]!, 'inline-choice__medication');
        expect(checkbox1).not.toBeChecked();

        await userEvent.click(checkbox1);
        expect(checkbox1).toBeChecked();

        // Choose another item in the list
        const checkbox2 = await findByTestId<HTMLInputElement>(questions[0]!, 'inline-choice__food');
        expect(checkbox2).not.toBeChecked();

        await userEvent.click(checkbox2);
        expect(checkbox1).not.toBeChecked();
        expect(checkbox2).toBeChecked();
    },
};

export const Multiple: Story = {
    render: () => <InlineChoice parentPath={[]} questionItem={questionItemMultiple} context={{} as ItemContext} />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const getQuestion = () => canvas.findAllByTestId('reaction');

        const questions: HTMLElement[] = await getQuestion();
        expect(questions.length > 0).toBe(true);

        // Choose an item in the list
        const checkbox1 = await findByTestId<HTMLInputElement>(questions[0]!, 'inline-choice__headache');
        expect(checkbox1).not.toBeChecked();

        await userEvent.click(checkbox1);
        expect(checkbox1).toBeChecked();

        // Choose another item in the list
        const checkbox2 = await findByTestId<HTMLInputElement>(questions[0]!, 'inline-choice__nausea');
        expect(checkbox2).not.toBeChecked();

        await userEvent.click(checkbox2);
        expect(checkbox1).toBeChecked();
        expect(checkbox2).toBeChecked();
    },
};

export const Horizontal: Story = {
    render: () => (
        <InlineChoice
            parentPath={[]}
            questionItem={{
                ...questionItemMultiple,
                choiceOrientation: 'horizontal',
            }}
            context={{} as ItemContext}
        />
    ),
};

const questionItemDefault: QuestionnaireItem = {
    text: 'Type',
    type: 'choice',
    linkId: 'type',
    required: true,
    answerOption: [
        {
            value: {
                Coding: {
                    code: 'medication',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Medication',
                },
            },
        },
        {
            value: {
                Coding: {
                    code: 'food',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Food',
                },
            },
        },
        {
            value: {
                Coding: {
                    code: 'environment',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Environment',
                },
            },
        },
    ],
    itemControl: {
        coding: [
            {
                code: 'inline-choice',
            },
        ],
    },
};

const questionItemMultiple: QuestionnaireItem = {
    text: 'Reaction',
    type: 'choice',
    linkId: 'reaction',
    repeats: true,
    answerOption: [
        {
            value: {
                Coding: {
                    code: '39579001',
                    system: 'http://snomed.ct',
                    display: 'Anaphylaxis',
                },
            },
        },
        {
            value: {
                Coding: {
                    code: '25064002',
                    system: 'http://snomed.ct',
                    display: 'Headache',
                },
            },
        },
        {
            value: {
                Coding: {
                    code: '247472004',
                    system: 'http://snomed.ct',
                    display: 'Hives (Wheal)',
                },
            },
        },
        {
            value: {
                Coding: {
                    code: '422587007',
                    system: 'http://snomed.ct',
                    display: 'Nausea',
                },
            },
        },
        {
            value: {
                Coding: {
                    code: '422400008',
                    system: 'http://snomed.ct',
                    display: 'Vomiting',
                },
            },
        },
    ],
    itemControl: {
        coding: [
            {
                code: 'inline-choice',
            },
        ],
    },
};
