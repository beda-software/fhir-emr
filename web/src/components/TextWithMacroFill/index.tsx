import { t, Trans } from '@lingui/macro';
import { Button, Form, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { QRFContextData, QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import s from './TextWithMacroFill.module.scss';

interface QuestionFieldProps {
    questionItem: QuestionnaireItem;
    qrfContext: QRFContextData;
    value?: string;
    onChange?: (value: string | undefined) => void;
    disabled?: boolean;
}

function QuestionField(props: QuestionFieldProps) {
    const { value, onChange, disabled } = props;
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
                    <span className={s.label}>{text}</span>
                    <Button type="primary" onClick={onFill} disabled={value === fillText}>
                        <Trans>Fill</Trans>
                    </Button>
                </div>
                <TextArea
                    autoSize
                    allowClear
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.currentTarget.value)}
                />
            </div>
        </>
    );
}

export function TextWithMacroFill({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem} label={undefined}>
            <QuestionField
                value={value}
                onChange={onChange}
                qrfContext={qrfContext}
                questionItem={questionItem}
                disabled={disabled}
            />
        </Form.Item>
    );
}
