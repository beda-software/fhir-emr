import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionInteger } from './index';

export default {
    title: 'QuestionInteger',
    component: QuestionInteger,
    parameters: {
        storyshots: { disable: true },
    },
} as ComponentMeta<typeof QuestionInteger>;

const Template: ComponentStory<typeof QuestionInteger> = (args) => <QuestionInteger {...args} />;

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
