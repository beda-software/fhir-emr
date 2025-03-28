import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionSlider } from './index';

const meta: Meta<typeof QuestionSlider> = {
    title: 'Questionnaire / questions / slider',
    component: QuestionSlider,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionSlider>;

export const Basic: Story = {
    render: () => (
        <QuestionSlider
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'string',
                linkId: 'example',
                required: true,
                start: 1,
                stop: 10,
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Labels: Story = {
    render: () => (
        <QuestionSlider
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'string',
                linkId: 'example',
                required: true,
                start: 1,
                // TODO: Remove ignore and add startLabel to QuestionItem
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                startLabel: 'Start value',
                stop: 10,
                stopLabel: 'Stop value',
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Step: Story = {
    render: () => (
        <QuestionSlider
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'string',
                linkId: 'example',
                required: true,
                start: 1,
                stop: 50,
                sliderStepValue: 5,
            }}
            context={{} as ItemContext}
        />
    ),
};

export const HelpText: Story = {
    render: () => (
        <QuestionSlider
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'string',
                linkId: 'example',
                required: true,
                start: 1,
                stop: 10,
                helpText: 'Some additional information about the control',
            }}
            context={{} as ItemContext}
        />
    ),
};
