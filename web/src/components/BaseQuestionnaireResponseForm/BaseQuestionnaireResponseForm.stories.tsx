import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { en, ru } from 'make-plural';

import { BaseQuestionnaireResponseForm } from './index';

export const locales = {
    en: 'EN',
    ru: 'RU',
};

i18n.loadLocaleData({
    en: { plurals: en },
    ru: { plurals: ru },
});
i18n.activate('en');

export default {
    title: 'BaseQuestionnaireResponseForm',
    component: BaseQuestionnaireResponseForm,
    parameters: {
        storyshots: { disable: true },
    },
} as ComponentMeta<typeof BaseQuestionnaireResponseForm>;

const Template: ComponentStory<typeof BaseQuestionnaireResponseForm> = (args) => (
    <I18nProvider i18n={i18n}>
        <BaseQuestionnaireResponseForm {...args} />
    </I18nProvider>
);

export const Example = Template.bind({});
Example.args = {
    formData: {
        context: {
            questionnaire: {
                item: [
                    {
                        text: 'patientId',
                        type: 'string',
                        hidden: true,
                        linkId: 'patient-id',
                    },
                    {
                        text: 'Last name',
                        type: 'string',
                        linkId: 'last-name',
                        required: true,
                    },
                    {
                        text: 'First name',
                        type: 'string',
                        linkId: 'first-name',
                    },
                    {
                        text: 'Middle name',
                        type: 'string',
                        linkId: 'middle-name',
                    },
                    {
                        text: 'Birth date',
                        type: 'date',
                        linkId: 'birth-date',
                    },
                    {
                        text: 'Gender',
                        type: 'choice',
                        linkId: 'gender',
                        answerOption: [
                            {
                                value: {
                                    string: 'male',
                                },
                            },
                            {
                                value: {
                                    string: 'female',
                                },
                            },
                        ],
                    },
                    {
                        text: 'SSN',
                        type: 'string',
                        linkId: 'ssn',
                    },
                    {
                        text: 'Mobile phone',
                        type: 'string',
                        linkId: 'mobile',
                    },
                ],
                name: 'patient-create',
                title: 'Patient create',
                status: 'active',
                mapping: [
                    {
                        resourceType: 'Mapping',
                        id: 'patient-create',
                    },
                ],
                resourceType: 'Questionnaire',
                meta: {
                    lastUpdated: '2021-12-17T17:40:55.641038Z',
                    createdAt: '2021-12-17T09:49:49.348323Z',
                    versionId: '1048',
                },
                assembledFrom: 'patient-create',
            },
            questionnaireResponse: {
                resourceType: 'QuestionnaireResponse',
                //@ts-ignore
                questionnaire: null,
                item: [
                    {
                        linkId: 'patient-id',
                        text: 'patientId',
                    },
                    {
                        linkId: 'last-name',
                        text: 'Last name',
                    },
                    {
                        linkId: 'first-name',
                        text: 'First name',
                    },
                    {
                        linkId: 'middle-name',
                        text: 'Middle name',
                    },
                    {
                        linkId: 'birth-date',
                        text: 'Birth date',
                    },
                    {
                        linkId: 'gender',
                        text: 'Gender',
                    },
                    {
                        linkId: 'ssn',
                        text: 'SSN',
                    },
                    {
                        linkId: 'mobile',
                        text: 'Mobile phone',
                    },
                ],
            },
            launchContextParameters: [],
        },
        formValues: {},
    },
    //@ts-ignore
    onSubmit: () => console.log('onSubmit'),
    readOnly: undefined,
};
