import { FormProvider, useForm } from "react-hook-form";
import { FormItems } from "sdc-qrf";

export function StoryQuestionDecorator(props: React.HTMLAttributes<HTMLDivElement>) {
    const { children } = props;
    const methods = useForm<FormItems>();

    return <FormProvider {...methods}>{children}</FormProvider>;
}