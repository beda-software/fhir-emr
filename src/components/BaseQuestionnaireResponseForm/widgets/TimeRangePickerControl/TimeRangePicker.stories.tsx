import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { TimeRangePickerControl } from './index';

const meta: Meta<typeof TimeRangePickerControl> = {
    title: 'Questionnaire / questions / time-range-picker',
    component: TimeRangePickerControl,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof TimeRangePickerControl>;

export const CorrectItemsCount: Story = {
    render: () => (
        <TimeRangePickerControl
            parentPath={[]}
            questionItem={{
                text: 'Time range picker',
                type: 'time-range-picker',
                linkId: 'example',
                required: true,
                item: [
                    { type: 'time', linkId: 'start', entryFormat: 'Start time' },
                    { type: 'time', linkId: 'end', entryFormat: 'End time' },
                ],
            }}
            context={[] as ItemContext[]}
        />
    ),
};

export const NoItems: Story = {
    render: () => (
        <TimeRangePickerControl
            parentPath={[]}
            questionItem={{
                text: 'No items',
                type: 'time-range-picker',
                linkId: 'example',
                required: true,
            }}
            context={[] as ItemContext[]}
        />
    ),
};
