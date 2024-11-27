import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Meta, StoryObj } from '@storybook/react';

import { Questionnaire, QuestionnaireResponse } from '@beda.software/aidbox-types/index';
import { success } from '@beda.software/remote-data';

import { BaseQuestionnaireResponseForm } from 'src/components';

import { GroupWizardControlContext } from './context';
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
                        questionnaire,
                        launchContextParameters: [],
                        questionnaireResponse,
                    },
                    formValues,
                }}
            />
        </I18nProvider>
    ),
};

export const WithContext: Story = {
    render: () => (
        <GroupWizardControlContext.Provider
            value={{
                wizard: { labelPlacement: 'tooltip' },
            }}
        >
            <I18nProvider i18n={i18n}>
                <BaseQuestionnaireResponseForm
                    formData={{
                        context: {
                            questionnaire,
                            launchContextParameters: [],
                            questionnaireResponse,
                        },
                        formValues,
                    }}
                    onCancel={() => console.log('onCancel')}
                    saveButtonTitle={'Submit'}
                    autoSave
                    draftSaveResponse={success({} as any)}
                    setDraftSaveResponse={() => console.log('setDraftSaveResponse')}
                />
            </I18nProvider>
        </GroupWizardControlContext.Provider>
    ),
};

const questionnaire: Questionnaire = {
    subjectType: ['Patient'],
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
        lastUpdated: '2024-11-27T11:09:40.517127Z',
        versionId: '12846',
        createdAt: '2024-11-17T17:17:53.454248Z',
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
                            linkId: '1.1',
                            required: true,
                        },
                        {
                            text: 'On average, how many minutes do you engage in physical activity each day?',
                            type: 'integer',
                            linkId: '1.2',
                            required: true,
                        },
                        {
                            text: 'What types of physical activities do you participate in? (Select all that apply)',
                            type: 'choice',
                            linkId: '1.3',
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
                    linkId: '1',
                },
                {
                    item: [
                        {
                            text: 'How many servings of fruits and vegetables do you consume daily?',
                            type: 'integer',
                            linkId: '2.1',
                            required: true,
                        },
                        {
                            text: 'How often do you eat fast food?',
                            type: 'choice',
                            linkId: '2.2',
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
                            linkId: '2.3',
                            required: false,
                        },
                    ],
                    text: 'Dietary Habits',
                    type: 'group',
                    linkId: '2',
                },
                {
                    item: [
                        {
                            text: 'On average, how many hours of sleep do you get per night?',
                            type: 'integer',
                            linkId: '3.1',
                            required: true,
                        },
                        {
                            text: 'Do you have trouble falling asleep or staying asleep?',
                            type: 'choice',
                            linkId: '3.2',
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
                            linkId: '3.3',
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
                    linkId: '3',
                },
                {
                    item: [
                        {
                            text: 'Do you smoke tobacco or use nicotine products?',
                            type: 'choice',
                            linkId: '4.1',
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
                            linkId: '4.2',
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
                            linkId: '4.3',
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
                    linkId: '4',
                },
            ],
            type: 'group',
            linkId: 'wizard',
            itemControl: {
                coding: [
                    {
                        code: 'wizard',
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

const questionnaireResponse: QuestionnaireResponse = {
    status: 'in-progress',
    questionnaire: undefined,
    resourceType: 'QuestionnaireResponse',
    item: [
        {
            linkId: 'wizard',
            item: [
                {
                    linkId: '1',
                    text: 'Physical Activity',
                    item: [
                        {
                            linkId: '1.1',
                            text: 'How many days a week do you engage in physical activity?',
                        },
                        {
                            linkId: '1.2',
                            text: 'On average, how many minutes do you engage in physical activity each day?',
                        },
                        {
                            linkId: '1.3',
                            text: 'What types of physical activities do you participate in? (Select all that apply)',
                        },
                    ],
                },
                {
                    linkId: '2',
                    text: 'Dietary Habits',
                    item: [
                        {
                            linkId: '2.1',
                            text: 'How many servings of fruits and vegetables do you consume daily?',
                        },
                        {
                            linkId: '2.2',
                            text: 'How often do you eat fast food?',
                        },
                        {
                            linkId: '2.3',
                            text: 'Do you follow any specific dietary restrictions? (e.g., vegetarian, vegan, gluten-free)',
                        },
                    ],
                },
                {
                    linkId: '3',
                    text: 'Sleep Patterns',
                    item: [
                        {
                            linkId: '3.1',
                            text: 'On average, how many hours of sleep do you get per night?',
                        },
                        {
                            linkId: '3.2',
                            text: 'Do you have trouble falling asleep or staying asleep?',
                        },
                        {
                            linkId: '3.3',
                            text: 'Do you use any sleep aids (e.g., medication, herbal supplements)?',
                        },
                    ],
                },
                {
                    linkId: '4',
                    text: 'Substance Use',
                    item: [
                        {
                            linkId: '4.1',
                            text: 'Do you smoke tobacco or use nicotine products?',
                        },
                        {
                            linkId: '4.2',
                            text: 'How often do you consume alcoholic beverages?',
                        },
                        {
                            linkId: '4.3',
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
            '1': {
                question: 'Physical Activity',
                items: {},
            },
            '2': {
                question: 'Dietary Habits',
                items: {},
            },
            '3': {
                question: 'Sleep Patterns',
                items: {},
            },
            '4': {
                question: 'Substance Use',
                items: {},
            },
        },
    },
};
