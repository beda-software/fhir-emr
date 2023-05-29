import { t } from '@lingui/macro';
import { Button, Form } from 'antd';
import { FormProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';

import s from './QuestionnaireBuilder.module.scss';

interface PromptFormInterface {
    prompt: string;
}

interface Props extends FormProps {
    onSubmit: (prompt: string) => Promise<any>;
    isLoading?: boolean;
    visible?: boolean;
}

export function PromptForm(props: Props) {
    const { onSubmit, isLoading, visible, ...rest } = props;
    const [promptForm] = Form.useForm<PromptFormInterface>();
    const [prompts, setPrompts] = useState<string[]>([]);
    const disabled = isLoading;

    return (
        <Form<PromptFormInterface>
            layout="vertical"
            form={promptForm}
            onFinish={(values) => {
                if (values.prompt) {
                    onSubmit(values.prompt);
                    setPrompts([values.prompt, ...prompts]);
                    promptForm.resetFields();
                }
            }}
            style={{ display: visible ? 'block' : 'none' }}
            {...rest}
        >
            <Form.Item name="prompt" label={t`Describe requirements to a questionnaire`}>
                <TextArea rows={5} disabled={disabled} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" disabled={disabled}>{t`Submit`}</Button>
            </Form.Item>
            <div className={s.prompts}>
                {prompts.map((prompt, index) => (
                    <pre key={`${prompt}-${index}`} className={s.prompt}>
                        {prompt}
                    </pre>
                ))}
            </div>
        </Form>
    );
}
