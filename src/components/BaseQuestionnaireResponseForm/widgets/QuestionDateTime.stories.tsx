import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionDateTime } from './index';
import { StoryQuestionDecorator } from './utils-stories';

export default {
    title: 'widget/QuestionDateTime',
    component: QuestionDateTime,
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
} as ComponentMeta<typeof QuestionDateTime>;

const Template: ComponentStory<typeof QuestionDateTime> = (args) => <QuestionDateTime {...args} />;

export const DateOfBirth = Template.bind({});
DateOfBirth.args = {
    parentPath: [],
    questionItem: {
        text: 'Birth date',
        type: 'date',
        linkId: 'birth-date',
    },
};
