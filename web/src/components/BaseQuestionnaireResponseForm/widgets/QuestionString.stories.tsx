import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionString } from './index';
import { StoryQuestionDecorator } from './utils-stories';

export default {
    title: 'widget/QuestionString',
    component: QuestionString,
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
} as ComponentMeta<typeof QuestionString>;

const Template: ComponentStory<typeof QuestionString> = (args) => <QuestionString {...args} />;

export const LastName = Template.bind({});
LastName.args = {
    parentPath: [],
    questionItem: {
        text: 'Last name',
        type: 'string',
        linkId: 'last-name',
        required: true,
    },
};

export const FirstName = Template.bind({});
FirstName.args = {
    parentPath: [],
    questionItem: {
        text: 'First name',
        type: 'string',
        linkId: 'first-name',
    },
};

export const MiddleName = Template.bind({});
MiddleName.args = {
    parentPath: [],
    questionItem: {
        text: 'Middle name',
        type: 'string',
        linkId: 'middle-name',
    },
};
