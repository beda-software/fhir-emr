import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf/lib/types';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionDateTime } from './index';

const meta: Meta<typeof QuestionDateTime> = {
    title: 'Questionnaire / questions / dateTime',
    component: QuestionDateTime,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionDateTime>;

export const DateTime: Story = {
    render: () => (
        <QuestionDateTime
            parentPath={[]}
            questionItem={{
                text: 'Select date',
                type: 'dateTime',
                linkId: 'date',
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Date: Story = {
    render: () => (
        <QuestionDateTime
            parentPath={[]}
            questionItem={{
                text: 'Birth date',
                type: 'date',
                linkId: 'birth-date',
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Time: Story = {
    render: () => (
        <QuestionDateTime
            parentPath={[]}
            questionItem={{
                text: 'Select time',
                type: 'time',
                linkId: 'time',
            }}
            context={{} as ItemContext}
        />
    ),
};

export const FormatedTime: Story = {
    render: () => (
        <QuestionDateTime
            parentPath={[]}
            questionItem={{
                text: 'Time with no seconsd',
                type: 'time',
                linkId: 'time',
                regex: 'HH:mm',
            }}
            context={{} as ItemContext}
        />
    ),
};
