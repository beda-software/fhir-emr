import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionQuantity } from './index';

const meta: Meta<typeof QuestionQuantity> = {
    title: 'Questionnaire / questions / quantity',
    component: QuestionQuantity,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionQuantity>;

export const Example: Story = {
    render: () => (
        <QuestionQuantity
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'quantity',
                linkId: 'example',
                required: true,
                unitOption: [
                    {
                        code: 'foot',
                        system: 'http://unitsofmeasure.org',
                        display: 'ft',
                    },
                    {
                        code: 'inch',
                        system: 'http://unitsofmeasure.org',
                        display: 'in',
                    },
                    {
                        code: 'cm',
                        system: 'http://unitsofmeasure.org',
                        display: 'cm',
                    },
                ],
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Single: Story = {
    render: () => (
        <QuestionQuantity
            parentPath={[]}
            questionItem={{
                text: 'Example',
                type: 'quantity',
                linkId: 'example',
                required: true,
                unitOption: [
                    {
                        code: 'foot',
                        system: 'http://unitsofmeasure.org',
                        display: 'ft',
                    },
                ],
            }}
            context={{} as ItemContext}
        />
    ),
};
