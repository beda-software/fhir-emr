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

export const Example: Story = {
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
