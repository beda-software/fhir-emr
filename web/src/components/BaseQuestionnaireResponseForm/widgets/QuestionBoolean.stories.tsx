import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionBoolean } from './index';

export default {
    title: 'widget/QuestionBoolean',
    component: QuestionBoolean,
    parameters: {
        storyshots: { disable: true },
    },
} as ComponentMeta<typeof QuestionBoolean>;

const Template: ComponentStory<typeof QuestionBoolean> = (args) => <QuestionBoolean {...args} />;

export const Example = Template.bind({});
Example.args = {
    parentPath: [],
    questionItem: {
        text: 'Boolean question',
        type: 'boolean',
        linkId: 'example',
        required: true,
    },
};
