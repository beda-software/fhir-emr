import { ComponentStory, ComponentMeta } from '@storybook/react';

import { QuestionDateTime } from './index';

export default {
    title: 'QuestionDateTime',
    component: QuestionDateTime,
    parameters: {
        storyshots: { disable: true },
    },
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
