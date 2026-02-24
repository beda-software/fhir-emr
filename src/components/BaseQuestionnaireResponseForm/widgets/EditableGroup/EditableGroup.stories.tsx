import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Meta, StoryObj } from '@storybook/react';
import { QuestionnaireResponse } from 'fhir/r4b';
import { FCEQuestionnaire, fromFirstClassExtension } from 'sdc-qrf';

import { BaseQuestionnaireResponseForm } from 'src/components';
import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

interface EditableGroupProps {
    readOnly: boolean;
}

const meta: Meta<EditableGroupProps> = {
    title: 'Questionnaire / questions / EditableGroup',
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
    args: {
        readOnly: false,
    },
};

export default meta;
type Story = StoryObj<EditableGroupProps>;

export const Example: Story = {
    args: {
        readOnly: false,
    },
    render: ({ readOnly }) => (
        <I18nProvider i18n={i18n}>
            <BaseQuestionnaireResponseForm
                key={readOnly ? 'readOnly' : 'editable'}
                formData={{
                    context: {
                        fceQuestionnaire: getQuestionnaire(readOnly),
                        questionnaire: fromFirstClassExtension(getQuestionnaire(readOnly)),
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
            />
        </I18nProvider>
    ),
};

export const Readonly: Story = {
    args: {
        readOnly: true,
    },
    render: ({ readOnly }) => (
        <I18nProvider i18n={i18n}>
            <BaseQuestionnaireResponseForm
                key={readOnly ? 'readOnly' : 'editable'}
                formData={{
                    context: {
                        fceQuestionnaire: getQuestionnaire(readOnly),
                        questionnaire: fromFirstClassExtension(getQuestionnaire(readOnly)),
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
            />
        </I18nProvider>
    ),
};

function getQuestionnaire(readOnly: boolean): FCEQuestionnaire {
    return {
        assembledFrom: 'editable-group-demo',
        subjectType: ['Patient'],
        meta: {
            profile: ['https://emr-core.beda.software/StructureDefinition/fhir-emr-questionnaire'],
        },
        name: 'editable-group-demo',
        item: [
            {
                text: 'Editable Group',
                type: 'group',
                linkId: 'editable-group',
                readOnly,
                itemControl: {
                    coding: [
                        {
                            code: 'editable-group',
                        },
                    ],
                },
                item: [
                    {
                        text: 'Field 1',
                        type: 'string',
                        linkId: 'editable-group-field1',
                    },
                    {
                        text: 'Field 2',
                        type: 'string',
                        linkId: 'editable-group-field2',
                    },
                ],
            },
        ],
        resourceType: 'Questionnaire',
        title: 'EditableGroup demo',
        status: 'active',
        url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/editable-group-demo',
    };
}

const questionnaireResponse: QuestionnaireResponse = {
    subject: { reference: 'Patient/patient1' },
    questionnaire: 'editable-group-demo',
    item: [
        {
            linkId: 'editable-group',
            item: [
                {
                    linkId: 'editable-group-field1',
                    answer: [
                        {
                            valueString: 'Value 1',
                        },
                    ],
                },
                {
                    linkId: 'editable-group-field2',
                    answer: [
                        {
                            valueString: 'Value 2',
                        },
                    ],
                },
            ],
        },
    ],
    status: 'in-progress',
    authored: '2026-02-12T18:00:04Z',
    id: 'b4bd09a5-d956-42ea-b09c-0045a0c6a04b',
    resourceType: 'QuestionnaireResponse',
    meta: {
        lastUpdated: '2026-02-12T17:59:43.305860Z',
        versionId: '272',
        extension: [{ url: 'ex:createdAt', valueInstant: '2026-02-12T12:38:50.613417Z' }],
    },
};

const formValues = {
    'editable-group': {
        question: 'Editable Group',
        items: {
            'editable-group-field1': [
                {
                    question: 'Field 1',
                    value: {
                        string: 'Value 1',
                    },
                },
            ],
            'editable-group-field2': [
                {
                    question: 'Field 2',
                    value: {
                        string: 'Value 2',
                    },
                },
            ],
        },
    },
};
