import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionChoice } from './index';
import { StoryQuestionDecorator } from './utils-stories';

export default {
    title: 'widget/QuestionChoice',
    component: QuestionChoice,
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
} as ComponentMeta<typeof QuestionChoice>;

const Template: ComponentStory<typeof QuestionChoice> = (args) => <QuestionChoice {...args} />;

export const Example = Template.bind({});
Example.args = {
    parentPath: [],
    questionItem: {
        text: 'Select from list',
        type: 'choice',
        linkId: 'example',
        required: true,
        answerOption: [
            {value: {Coding: {code: '1', display: "Item 1"}}},
            {value: {Coding: {code: '2', display: "Item 2"}}},
            {value: {Coding: {code: '3', display: "Item 3"}}},
            {value: {Coding: {code: '4', display: "Item 4"}}},
        ]
    },
};
