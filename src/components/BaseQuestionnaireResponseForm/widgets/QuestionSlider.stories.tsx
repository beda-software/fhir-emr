import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionSlider } from './index';
import { StoryQuestionDecorator } from './utils-stories';

export default {
    title: 'widget/QuestionSlider',
    component: QuestionSlider,
    parameters: {
        storyshots: { disable: true },
    },
    decorators: [
        (Story) => (
            <StoryQuestionDecorator>
                <Story />
            </StoryQuestionDecorator>
        ),
    ],
} as ComponentMeta<typeof QuestionSlider>;

const Template: ComponentStory<typeof QuestionSlider> = (args) => <QuestionSlider {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    parentPath: [],
    questionItem: {
        text: 'Example',
        type: 'string',
        linkId: 'example',
        required: true,
        start: 1,
        stop: 10,
    } as any,
};


export const Labels = Template.bind({});
Labels.args = {
    parentPath: [],
    questionItem: {
        text: 'Example',
        type: 'string',
        linkId: 'example',
        required: true,
        start: 1,
        startLabel: 'Start value',
        stop: 10,
        stopLabel: 'Stop value'
    } as any,
};


export const Step = Template.bind({});
Step.args = {
    parentPath: [],
    questionItem: {
        text: 'Example',
        type: 'string',
        linkId: 'example',
        required: true,
        start: 1,
        stop: 50,
        sliderStepValue: 5,
    } as any,
};


export const HelpText = Template.bind({});
HelpText.args = {
    parentPath: [],
    questionItem: {
        text: 'Example',
        type: 'string',
        linkId: 'example',
        required: true,
        start: 1,
        stop: 10,
        helpText: "Some additional information about the control"
    } as any,
};

