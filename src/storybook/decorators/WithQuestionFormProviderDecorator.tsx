import { Decorator } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormItems } from 'sdc-qrf';

import s from 'src/components/BaseQuestionnaireResponseForm/BaseQuestionnaireResponseForm.module.scss';

export const WithQuestionFormProviderDecorator: Decorator = (Story) => {
    const methods = useForm<FormItems>();

    return (
        <FormProvider {...methods}>
            <form className={s.form}>
                <Story />
            </form>
        </FormProvider>
    );
};
