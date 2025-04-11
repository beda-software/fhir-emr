import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Meta, StoryObj } from '@storybook/react';

import { Questionnaire, QuestionnaireResponse } from '@beda.software/aidbox-types/index';

import { BaseQuestionnaireResponseForm, Modal } from 'src/components';

import { GroupWizard } from './index';

i18n.activate('en');

const meta: Meta<typeof GroupWizard> = {
    title: 'Questionnaire / GroupWizard',
    component: GroupWizard,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof GroupWizard>;

export const Default: Story = {
    render: () => (
        <I18nProvider i18n={i18n}>
            <BaseQuestionnaireResponseForm
                formData={{
                    context: {
                        questionnaire: getQuestionnaire(),
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
            />
        </I18nProvider>
    ),
};

export const WithTooltip: Story = {
    render: () => (
        <I18nProvider i18n={i18n}>
            <BaseQuestionnaireResponseForm
                formData={{
                    context: {
                        questionnaire: getQuestionnaire('wizard-with-tooltips'),
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
                onCancel={() => console.log('onCancel')}
                saveButtonTitle={'Save & complete'}
            />
        </I18nProvider>
    ),
};

export const Autosave: Story = {
    render: () => (
        <I18nProvider i18n={i18n}>
            <BaseQuestionnaireResponseForm
                formData={{
                    context: {
                        questionnaire: getQuestionnaire('wizard-with-tooltips'),
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
                onCancel={() => console.log('onCancel')}
                saveButtonTitle={'Submit'}
                autoSave
            />
        </I18nProvider>
    ),
};

export const SaveAsDraft: Story = {
    render: () => (
        <I18nProvider i18n={i18n}>
            <BaseQuestionnaireResponseForm
                formData={{
                    context: {
                        questionnaire: getQuestionnaire('wizard-with-tooltips'),
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
                onCancel={() => console.log('onCancel')}
                saveButtonTitle={'Submit'}
                autoSave={false}
            />
        </I18nProvider>
    ),
};

export const inModal: Story = {
    render: () => (
        <I18nProvider i18n={i18n}>
            <Modal open={true} title={'Wizard in modal'} footer={null}>
                <BaseQuestionnaireResponseForm
                    formData={{
                        context: {
                            questionnaire: getQuestionnaire('wizard-with-tooltips'),
                            launchContextParameters: [],
                            questionnaireResponse,
                        },
                        formValues,
                    }}
                />
            </Modal>
        </I18nProvider>
    ),
};

function getQuestionnaire(itemControlCode: 'wizard' | 'wizard-with-tooltips' = 'wizard'): Questionnaire {
    return {
        assembledFrom: 'group-wizard',
        subjectType: ['Patient'],
        meta: {
            profile: ['https://beda.software/beda-emr-questionnaire'],
        },
        name: 'Group wizard',
        item: [
            {
                item: [
                    {
                        item: [
                            {
                                text: 'How many days a week do you engage in physical activity?',
                                type: 'integer',
                                linkId: 'q11',
                                required: true,
                            },
                            {
                                text: 'On average, how many minutes do you engage in physical activity each day?',
                                type: 'integer',
                                linkId: 'q12',
                                required: true,
                            },
                            {
                                text: 'What types of physical activities do you participate in? (Select all that apply)',
                                type: 'choice',
                                linkId: 'q13',
                                required: false,
                                answerOption: [
                                    {
                                        value: {
                                            string: 'Walking',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Running',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Cycling',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Swimming',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Weightlifting',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Other',
                                        },
                                    },
                                ],
                            },
                        ],
                        text: 'Physical Activity',
                        type: 'group',
                        linkId: 'physical-activity',
                    },
                    {
                        item: [
                            {
                                text: 'How many servings of fruits and vegetables do you consume daily?',
                                type: 'integer',
                                linkId: 'q21',
                                required: true,
                            },
                            {
                                text: 'How often do you eat fast food?',
                                type: 'choice',
                                linkId: 'q22',
                                required: true,
                                answerOption: [
                                    {
                                        value: {
                                            string: 'Never',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Once a week',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Several times a week',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Daily',
                                        },
                                    },
                                ],
                            },
                            {
                                text: 'Do you follow any specific dietary restrictions? (e.g., vegetarian, vegan, gluten-free)',
                                type: 'string',
                                linkId: 'q23',
                                required: false,
                            },
                        ],
                        text: 'Dietary Habits',
                        type: 'group',
                        linkId: 'dietary-habits',
                    },
                    {
                        item: [
                            {
                                text: 'On average, how many hours of sleep do you get per night?',
                                type: 'integer',
                                linkId: 'q31',
                                required: true,
                            },
                            {
                                text: 'Do you have trouble falling asleep or staying asleep?',
                                type: 'choice',
                                linkId: 'q32',
                                required: true,
                                answerOption: [
                                    {
                                        value: {
                                            string: 'Yes',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'No',
                                        },
                                    },
                                ],
                            },
                            {
                                text: 'Do you use any sleep aids (e.g., medication, herbal supplements)?',
                                type: 'choice',
                                linkId: 'q33',
                                required: false,
                                answerOption: [
                                    {
                                        value: {
                                            string: 'Yes',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'No',
                                        },
                                    },
                                ],
                            },
                        ],
                        text: 'Sleep Patterns',
                        type: 'group',
                        linkId: 'sleep-patterns',
                    },
                    {
                        item: [
                            {
                                text: 'Do you smoke tobacco or use nicotine products?',
                                type: 'choice',
                                linkId: 'q41',
                                required: true,
                                answerOption: [
                                    {
                                        value: {
                                            string: 'Yes',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'No',
                                        },
                                    },
                                ],
                            },
                            {
                                text: 'How often do you consume alcoholic beverages?',
                                type: 'choice',
                                linkId: 'q42',
                                required: true,
                                answerOption: [
                                    {
                                        value: {
                                            string: 'Never',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Occasionally',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'Regularly',
                                        },
                                    },
                                ],
                            },
                            {
                                text: 'Have you ever used recreational drugs?',
                                type: 'choice',
                                linkId: 'q43',
                                required: false,
                                answerOption: [
                                    {
                                        value: {
                                            string: 'Yes',
                                        },
                                    },
                                    {
                                        value: {
                                            string: 'No',
                                        },
                                    },
                                ],
                            },
                        ],
                        text: 'Substance Use',
                        type: 'group',
                        linkId: 'substance-use',
                    },
                ],
                type: 'group',
                linkId: 'wizard',
                itemControl: {
                    coding: [
                        {
                            code: itemControlCode,
                        },
                    ],
                },
            },
        ],
        resourceType: 'Questionnaire',
        title: 'Group wizard',
        status: 'active',
        url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/group-wizard',
    };
}

const questionnaireResponse: QuestionnaireResponse = {
    questionnaire: undefined,
    status: 'in-progress',
    resourceType: 'QuestionnaireResponse',
    item: [
        {
            linkId: 'wizard',
            item: [
                {
                    linkId: 'physical-activity',
                    text: 'Physical Activity',
                    item: [
                        {
                            linkId: 'q11',
                            text: 'How many days a week do you engage in physical activity?',
                        },
                        {
                            linkId: 'q12',
                            text: 'On average, how many minutes do you engage in physical activity each day?',
                        },
                        {
                            linkId: 'q13',
                            text: 'What types of physical activities do you participate in? (Select all that apply)',
                        },
                    ],
                },
                {
                    linkId: 'dietary-habits',
                    text: 'Dietary Habits',
                    item: [
                        {
                            linkId: 'q21',
                            text: 'How many servings of fruits and vegetables do you consume daily?',
                        },
                        {
                            linkId: 'q22',
                            text: 'How often do you eat fast food?',
                        },
                        {
                            linkId: 'q23',
                            text: 'Do you follow any specific dietary restrictions? (e.g., vegetarian, vegan, gluten-free)',
                        },
                    ],
                },
                {
                    linkId: 'sleep-patterns',
                    text: 'Sleep Patterns',
                    item: [
                        {
                            linkId: 'q31',
                            text: 'On average, how many hours of sleep do you get per night?',
                        },
                        {
                            linkId: 'q32',
                            text: 'Do you have trouble falling asleep or staying asleep?',
                        },
                        {
                            linkId: 'q33',
                            text: 'Do you use any sleep aids (e.g., medication, herbal supplements)?',
                        },
                    ],
                },
                {
                    linkId: 'substance-use',
                    text: 'Substance Use',
                    item: [
                        {
                            linkId: 'q41',
                            text: 'Do you smoke tobacco or use nicotine products?',
                        },
                        {
                            linkId: 'q42',
                            text: 'How often do you consume alcoholic beverages?',
                        },
                        {
                            linkId: 'q43',
                            text: 'Have you ever used recreational drugs?',
                        },
                    ],
                },
            ],
        },
    ],
    subject: {
        id: 'patient1',
        resourceType: 'Patient',
    },
};

const formValues = {
    wizard: {
        items: {
            'physical-activity': {
                question: 'Physical Activity',
                items: {},
            },
            'dietary-habits': {
                question: 'Dietary Habits',
                items: {},
            },
            'sleep-patterns': {
                question: 'Sleep Patterns',
                items: {},
            },
            'substance-use': {
                question: 'Substance Use',
                items: {},
            },
        },
    },
};
