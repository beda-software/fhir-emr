import { Decorator } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormItems } from 'sdc-qrf';

export const WithQuestionFormProviderDecorator: Decorator = (Story) => {
    const methods = useForm<FormItems>();

    return (
        <FormProvider {...methods}>
            <Story />
        </FormProvider>
    );
};
