import { Meta, StoryObj } from '@storybook/react';
import { ItemContext } from 'sdc-qrf';

import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { QuestionReference } from './reference';
import { ReferenceRadioButton } from './ReferenceRadioButton';

const meta: Meta<typeof QuestionReference> = {
    title: 'Questionnaire / questions / reference',
    component: QuestionReference,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof QuestionReference>;

export const Basic: Story = {
    render: () => (
        <QuestionReference
            parentPath={[]}
            questionItem={{
                text: 'Select practitioner',
                type: 'reference',
                linkId: 'practitioner-role',
                required: true,
                referenceResource: ['PractitionerRole'],
                choiceColumn: [
                    {
                        forDisplay: true,
                        path: "practitioner.resource.name.given.first() + ' ' + practitioner.resource.name.family + iif(specialty.exists(), ' - ' +specialty.first().coding.display, '')",
                    },
                ],
                answerExpression: {
                    language: 'application/x-fhir-query',
                    expression: 'PractitionerRole?_assoc=practitioner',
                },
            }}
            context={{} as ItemContext}
        />
    ),
};

export const Radio: Story = {
    render: () => (
        <ReferenceRadioButton
            parentPath={[]}
            questionItem={{
                text: 'Select practitioner',
                type: 'reference',
                linkId: 'practitioner-role',
                required: true,
                itemControl: {
                    coding: [
                        {
                            code: 'reference-radio-button',
                        },
                    ],
                },
                referenceResource: ['PractitionerRole'],
                choiceColumn: [
                    {
                        forDisplay: true,
                        path: "practitioner.resource.name.given.first() + ' ' + practitioner.resource.name.family + iif(specialty.exists(), ' - ' +specialty.first().coding.display, '')",
                    },
                ],
                answerExpression: {
                    language: 'application/x-fhir-query',
                    expression: 'PractitionerRole?_assoc=practitioner',
                },
            }}
            context={{} as ItemContext}
        />
    ),
};
