import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionSolidRadio } from './index';
import { StoryQuestionDecorator } from './utils-stories';

export default {
    title: 'widget/QuestionRadio',
    component: QuestionSolidRadio,
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
} as ComponentMeta<typeof QuestionSolidRadio>;

const Template: ComponentStory<typeof QuestionSolidRadio> = (args) => <QuestionSolidRadio {...args} />;

export const SingleLine = Template.bind({});
SingleLine.args = {
    parentPath: [],
    questionItem: {
        text: 'Select from list',
        type: 'string',
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


export const RightOption = Template.bind({});
RightOption.args = {
    parentPath: [],
    questionItem: {
        text: 'Select from list',
        type: 'string',
        linkId: 'example',
        required: true,
        adjustLastToRight: true,
        answerOption: [
            {value: {Coding: {code: '1', display: "Item 1"}}},
            {value: {Coding: {code: '2', display: "Item 2"}}},
            {value: {Coding: {code: '3', display: "Item 3"}}},
            {value: {Coding: {code: '4', display: "Item 4"}}},
            {value: {Coding: {code: '0', display: "None"}}},
        ]
    } as any,
};

