import { useForm, useFormContext, FormProvider } from 'react-hook-form';

import {
    calcInitialContext,
    FormItems,
    GroupItemProps,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'shared/src/utils/qrf';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
}

export function QuestionnaireResponseForm({ formData, onSubmit }: Props) {
    // TODO: why it falls with TS error what FormItems is used?
    const form = useForm<any>({ defaultValues: formData.formValues });
    const { handleSubmit, watch, setValue } = form;
    const formValues = watch();

    return (
        <FormProvider {...form}>
            <QuestionnaireResponseFormProvider
                formValues={formValues as FormItems}
                setFormValue={setValue}
                groupItemComponent={Group}
                questionItemComponents={{
                    text: QuestionText,
                    string: QuestionText,
                    decimal: QuestionDecimal,
                    integer: QuestionInteger,
                }}
            >
                <form
                    onSubmit={handleSubmit((values) =>
                        onSubmit({ ...formData, formValues: values }),
                    )}
                >
                    <QuestionItems
                        questionItems={formData.context.questionnaire.item!}
                        parentPath={[]}
                        context={calcInitialContext(formData.context, formValues)}
                    />
                    <input type="submit" />
                </form>
            </QuestionnaireResponseFormProvider>
        </FormProvider>
    );
}

function Group(_props: GroupItemProps) {
    return null;
}

function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { register } = useFormContext();

    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'].join('.');

    return <input {...register(fieldName)} />;
}

function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { register } = useFormContext();

    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'].join('.');

    return <input {...register(fieldName)} />;
}

function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const { register } = useFormContext();

    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'].join('.');

    return <input {...register(fieldName)} />;
}
