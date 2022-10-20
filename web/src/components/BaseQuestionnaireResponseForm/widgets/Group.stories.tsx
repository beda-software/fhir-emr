import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { Group } from './index';

export default {
    title: 'group/Group',
    component: Group,
    parameters: {
        storyshots: { disable: true },
    },
} as ComponentMeta<typeof Group>;

const Template: ComponentStory<typeof Group> = (args) => <Group {...args} />;

export const Example = Template.bind({});
Example.args = {
    context: [{questionnaire: {item: []}} as  unknown as ItemContext],
    parentPath: [],
    questionItem: {
        text: 'Group Title',
        type: 'group',
        linkId: 'example',
        required: true,
    },
};
