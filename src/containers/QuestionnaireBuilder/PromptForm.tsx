import { t } from '@lingui/macro';
import { Button, Form, Input, Timeline } from 'antd';
import { FormProps } from 'antd/lib/form';
import { useState } from 'react';

import s from './QuestionnaireBuilder.module.scss';

const { TextArea } = Input;

interface PromptFormInterface {
    prompt: string;
}

interface Props extends FormProps {
    onSubmit: (prompt: string) => Promise<any>;
    onPromptSelect: (prompt: string) => void;
    selectedPrompt?: string;
    isLoading?: boolean;
    visible?: boolean;
}

export function PromptForm(props: Props) {
    const { onSubmit, onPromptSelect, selectedPrompt, isLoading, visible, ...rest } = props;
    const [promptForm] = Form.useForm<PromptFormInterface>();
    const [prompts, setPrompts] = useState<string[]>([]);
    const disabled = isLoading;
    const timelineColor = (prompt: string, currentPrompt: string | undefined) =>
        isLoading ? 'gray' : prompt === currentPrompt ? 'green' : 'blue';

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
                <Timeline>
                    {prompts.map((prompt, index) => (
                        <Timeline.Item
                            key={`${prompt}-${index}-timeline-item`}
                            color={timelineColor(prompt, selectedPrompt)}
                        >
                            <div
                                key={`${prompt}-${index}-div`}
                                onClick={() => onPromptSelect(prompt)}
                                className={s.singlePromptContainer}
                                style={disabled ? { pointerEvents: 'none' } : {}}
                            >
                                <pre key={`${prompt} - ${index}`} className={s.prompt}>
                                    {prompt}
                                </pre>
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        </Form>
    );
}
