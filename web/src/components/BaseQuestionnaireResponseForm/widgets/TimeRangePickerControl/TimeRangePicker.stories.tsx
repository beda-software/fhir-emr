import { ComponentStory, ComponentMeta } from '@storybook/react';

import { StoryQuestionDecorator } from 'src/components/BaseQuestionnaireResponseForm/widgets/utils-stories';

import { TimeRangePickerControl } from './index';

export default {
    title: 'widget/TimeRangePicker',
    component: TimeRangePickerControl,
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
} as ComponentMeta<typeof TimeRangePickerControl>;

const Template: ComponentStory<typeof TimeRangePickerControl> = (args) => (
    <TimeRangePickerControl {...args} />
);

export const CorrectItemsCount = Template.bind({});
CorrectItemsCount.args = {
    parentPath: [],
    questionItem: {
        text: 'Time range picker',
        type: 'time-range-picker',
        linkId: 'example',
        required: true,
        item: [
            { type: 'time', linkId: 'start' },
            { type: 'time', linkId: 'end' },
        ],
    },
};

export const NoItems = Template.bind({});
NoItems.args = {
    parentPath: [],
    questionItem: {
        text: 'No items',
        type: 'time-range-picker',
        linkId: 'example',
        required: true,
    },
};
