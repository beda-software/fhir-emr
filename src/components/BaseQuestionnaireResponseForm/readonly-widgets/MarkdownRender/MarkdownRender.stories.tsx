import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Meta, StoryObj } from '@storybook/react';
import { QuestionnaireResponse } from 'fhir/r4b';
import { FCEQuestionnaire, fromFirstClassExtension } from 'sdc-qrf';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm/ReadonlyQuestionnaireResponseForm';
import { WithQuestionFormProviderDecorator, withColorSchemeDecorator } from 'src/storybook/decorators';

import { MarkdownRenderControl } from './index';

const meta: Meta<typeof MarkdownRenderControl> = {
    title: 'Readonly Questionnaire / markdown',
    component: MarkdownRenderControl,
    decorators: [withColorSchemeDecorator, WithQuestionFormProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderControl>;

export const Example: Story = {
    render: () => (
        <I18nProvider i18n={i18n}>
            <ReadonlyQuestionnaireResponseForm
                formData={{
                    context: {
                        fceQuestionnaire: getQuestionnaire(),
                        questionnaire: fromFirstClassExtension(getQuestionnaire()),
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
            />
        </I18nProvider>
    ),
};

function getQuestionnaire(): FCEQuestionnaire {
    return {
        assembledFrom: 'markdown-demo',
        subjectType: ['Patient'],
        meta: {
            profile: ['https://emr-core.beda.software/StructureDefinition/fhir-emr-questionnaire'],
        },
        name: 'markdown-demo',
        item: [
            {
                text: 'Note',
                type: 'string',
                linkId: 'note-content',
                itemControl: {
                    coding: [
                        {
                            code: 'markdown-editor',
                        },
                    ],
                },
            },
        ],
        resourceType: 'Questionnaire',
        title: 'Markdown demo',
        status: 'active',
        url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/markdown-demo',
    };
}

const questionnaireResponse: QuestionnaireResponse = {
    subject: { reference: 'Patient/patient1' },
    questionnaire: 'markdown-demo',
    item: [
        {
            linkId: 'note-content',
            answer: [
                {
                    valueString:
                        '# Heading 1&#x20;\n\n![](https://picsum.photos/id/51/800/600)\n\n## Heading 2\n\n### Heading 3\n\n#### Heading 4\n\n##### Heading 5\n\n###### Heading 6\n\nCommon paragraph.\n\n**Bold** *Italic* <u>Underlined</u>\n\n* item\n* item\n\n1. item 1\n2. item 2\n\n* [ ] to-do 1\n* [ ] to-do 2\n\n`inline code-block`\n\n> Quotation\n\n:::note\nNote\n:::\n\n:::tip\nTip\n:::\n\n:::danger\nDanger\n:::\n\n:::info\nInfo\n:::\n\n:::caution\nCaution\n:::\n\nTable\n\n| H1    | H2    | H3    |\n| ----- | ----- | ----- |\n| data1 | data2 | data3 |\n| data1 | data2 | data3 |\n\n',
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
    'note-content': [
        {
            question: 'Note',
            value: {
                string: '# Heading 1&#x20;\n\n![](https://picsum.photos/id/51/800/600)\n\n## Heading 2\n\n### Heading 3\n\n#### Heading 4\n\n##### Heading 5\n\n###### Heading 6\n\nCommon paragraph.\n\n**Bold** *Italic* <u>Underlined</u>\n\n* item\n* item\n\n1. item 1\n2. item 2\n\n* [x] to-do 1\n* [ ] to-do 2\n\n`inline code-block`\n\n> Quotation\n\n:::note\nNote\n:::\n\n:::tip\nTip\n:::\n\n:::danger\nDanger\n:::\n\n:::info\nInfo\n:::\n\n:::caution\nCaution\n:::\n\nTable\n\n| H1    | H2    | H3    |\n| ----- | ----- | ----- |\n| data1 | data2 | data3 |\n| data1 | data2 | data3 |\n\n',
            },
        },
    ],
};
