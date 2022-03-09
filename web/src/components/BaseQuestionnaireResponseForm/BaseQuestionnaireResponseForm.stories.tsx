import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BaseQuestionnaireResponseForm } from './index';

export default {
    title: 'BaseQuestionnaireResponseForm',
    component: BaseQuestionnaireResponseForm,
    parameters: {
        storyshots: { disable: true },
    },
} as ComponentMeta<typeof BaseQuestionnaireResponseForm>;

const Template: ComponentStory<typeof BaseQuestionnaireResponseForm> = (args) => (
    <BaseQuestionnaireResponseForm {...args} />
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
                        text: 'Фамилия',
                        type: 'string',
                        linkId: 'last-name',
                        required: true,
                    },
                    {
                        text: 'Имя',
                        type: 'string',
                        linkId: 'first-name',
                    },
                    {
                        text: 'Отчество',
                        type: 'string',
                        linkId: 'middle-name',
                    },
                    {
                        text: 'Дата рождения',
                        type: 'date',
                        linkId: 'birth-date',
                    },
                    {
                        text: 'Пол',
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
                        text: 'СНИЛС',
                        type: 'string',
                        linkId: 'snils',
                    },
                    {
                        text: 'Телефон',
                        type: 'string',
                        linkId: 'mobile',
                    },
                ],
                name: 'patient-create',
                title: 'Создание пациента',
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
                        text: 'Фамилия',
                    },
                    {
                        linkId: 'first-name',
                        text: 'Имя',
                    },
                    {
                        linkId: 'middle-name',
                        text: 'Отчество',
                    },
                    {
                        linkId: 'birth-date',
                        text: 'Дата рождения',
                    },
                    {
                        linkId: 'gender',
                        text: 'Пол',
                    },
                    {
                        linkId: 'snils',
                        text: 'СНИЛС',
                    },
                    {
                        linkId: 'mobile',
                        text: 'Телефон',
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
