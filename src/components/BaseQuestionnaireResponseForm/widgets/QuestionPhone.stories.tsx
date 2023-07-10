import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionPhone } from './index';
import { StoryQuestionDecorator } from './utils-stories';

export default {
    title: 'widget/QuestionPhone',
    component: QuestionPhone,
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
} as ComponentMeta<typeof QuestionPhone>;

const Template: ComponentStory<typeof QuestionPhone> = (args) => <QuestionPhone {...args} />;

export const Example = Template.bind({});
Example.args = {
    parentPath: [],
    questionItem: {
        text: 'Example',
        type: 'string',
        linkId: 'example',
        required: true,
    },
};
