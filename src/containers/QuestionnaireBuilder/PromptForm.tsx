import { DeleteOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Form, Input, Timeline } from 'antd';
import { FormProps } from 'antd/lib/form';

import s from './QuestionnaireBuilder.module.scss';
import { QuestionnaireFromPdfButton } from './QuestionnaireFromPdfButton';

const { TextArea } = Input;

interface PromptFormInterface {
    prompt: string;
}

interface Props extends FormProps {
    onSubmit: (prompt: string) => Promise<any>;
    onPromptSelect: (prompt: string) => void;
    editHistory: object;
    onPromptDelete: (prompt: string) => void;
    selectedPrompt?: string;
    isLoading?: boolean;
    visible?: boolean;
}

export function PromptForm(props: Props) {
    const { onSubmit, onPromptSelect, selectedPrompt, editHistory, onPromptDelete, isLoading, visible, ...rest } =
        props;
    const [promptForm] = Form.useForm<PromptFormInterface>();
    const disabled = isLoading;

    const items = Object.keys(editHistory).map((prompt, index) => {
        return {
            color: isLoading ? 'gray' : prompt === selectedPrompt ? 'green' : 'blue',
            children: (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                    <div>
                        <Button
                            onClick={() => onPromptDelete(prompt)}
                            type="primary"
                            disabled={isLoading || Object.keys(editHistory).length === 1}
                        >
                            <DeleteOutlined />
                        </Button>
                    </div>
                </div>
            ),
        };
    });

    return (
        <Form<PromptFormInterface>
            layout="vertical"
            form={promptForm}
            onFinish={(values) => {
                if (values.prompt) {
                    onSubmit(values.prompt);
                    promptForm.resetFields();
                }
            }}
            style={{ display: visible ? 'block' : 'none' }}
            {...rest}
        >
            <Form.Item name="prompt" label={t`Describe requirements to a questionnaire`}>
                <TextArea rows={5} disabled={disabled} />
            </Form.Item>
            <div className={s.submitButtons}>
                <Form.Item>
                    <Button htmlType="submit" disabled={disabled}>{t`Submit`}</Button>
                </Form.Item>
                <QuestionnaireFromPdfButton onSubmit={onSubmit} disabled={disabled} />
            </div>
            <div className={s.prompts}>
                <Timeline items={items} />
            </div>
        </Form>
    );
}
