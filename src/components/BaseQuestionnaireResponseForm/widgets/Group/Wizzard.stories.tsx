import type { Meta, StoryObj } from '@storybook/react';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { Wizzard } from './Wizzard';
import { QuestionnaireItem } from 'shared/src/contrib/aidbox';
import { ItemContext, QuestionnaireResponseFormProvider } from 'sdc-qrf';

import { QuestionString } from '../string';

const meta: Meta<typeof Wizzard> = {
    title: 'Questionnaire / questions / wizzard',
    component: Wizzard,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof Wizzard>;

const questionItem: QuestionnaireItem = {
    text: 'Wizzard Title',
    type: 'group',
    linkId: 'example',
    required: true,
    item: [
        {
            type: 'group',
            linkId: 'step-1',
            text: 'Step 1',
            item: [{ type: 'string', linkId: 'step-1-1', text: "First name" }]
        },
        {
            type: 'group',
            linkId: 'step-2',
            text: 'Step 2',
            item: [{ type: 'string', linkId: 'step-2-1', text: "Last name" }]
        },
        {
            type: 'group',
            linkId: 'step-3',
            text: 'Step 3',
            item: [{ type: 'string', linkId: 'step-3-1', text: "Middle name" }]
        }
    ]
};

const context: ItemContext = {
    resource: {resourceType: "QuestionnaireResponse", status: 'draft', item: [{linkId: 'example'}]},
    questionnaire: {resourceType: "Questionnaire", status: 'active', item: [questionItem]},
    context: {linkId: 'example'}
};

const groupItem = {
    parentPath: [],
    questionItem,
    context: [context]
}


export const Example: Story = {
    render: () => (
        <QuestionnaireResponseFormProvider
            formValues={{}}
            setFormValues={() => {}}
            questionItemComponents={{ string: QuestionString }}
        >
            <Wizzard groupItem={groupItem} />
        </QuestionnaireResponseFormProvider>
    ),
};
