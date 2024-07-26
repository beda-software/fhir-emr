import { t, Trans } from '@lingui/macro';
import { Button, Form, Input, notification } from 'antd';
import { QRFContextData, QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import s from './TextWithMacroFill.module.scss';
import { Text } from '../Typography';

interface QuestionFieldProps {
    questionItem: QuestionnaireItem;
    qrfContext: QRFContextData;
    value?: string;
    onChange?: (value: string | undefined) => void;
    disabled?: boolean;
    placeholder?: string;
}

function QuestionField(props: QuestionFieldProps) {
    const { value, onChange, disabled, placeholder } = props;
    const { text, macro } = props.questionItem;

    const fillText = macro;
    const onFill = () => {
        if (fillText && onChange) {
            onChange(fillText);
        } else {
            notification.warning({ message: t`No prepared text` });
        }
    };

    return (
        <>
            <div className={s.inputContainer}>
                <div className={s.inputHeader}>
                    <Text className={s.label}>{text}</Text>
                    <Button type="primary" onClick={onFill} disabled={value === fillText}>
                        <Trans>Fill</Trans>
                    </Button>
                </div>
                <Input.TextArea
                    autoSize
                    allowClear
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.currentTarget.value)}
                    placeholder={placeholder}
                />
            </div>
        </>
    );
}

export function TextWithMacroFill({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem} label={undefined}>
            <QuestionField
                value={value}
                onChange={onChange}
                qrfContext={qrfContext}
                questionItem={questionItem}
                disabled={disabled}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}
