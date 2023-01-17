import { Checkbox, Form, Radio, Space } from 'antd';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { getDisplay } from 'src/utils/questionnaire';

export function InlineChoice({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, answerOption, readOnly, hidden, repeats } = questionItem;

    if (hidden) {
        return null;
    }

    if (repeats) {
        const fieldName = [...parentPath, linkId];

        return (
            <Form.Item label={text} name={fieldName}>
                <Checkbox.Group disabled={readOnly || qrfContext.readOnly}>
                    <Space direction="vertical">
                        {answerOption?.map((answerOption) => (
                            <Checkbox value={answerOption} key={JSON.stringify(answerOption)}>
                                {getDisplay(answerOption.value!)}
                            </Checkbox>
                        ))}
                    </Space>
                </Checkbox.Group>
            </Form.Item>
        );
    } else {
        const fieldName = [...parentPath, linkId, 0];

        return (
            <Form.Item label={text} name={fieldName}>
                <Radio.Group disabled={readOnly || qrfContext.readOnly}>
                    <Space direction="vertical">
                        {answerOption?.map((answerOption) => (
                            <Radio value={answerOption} key={JSON.stringify(answerOption)}>
                                {getDisplay(answerOption.value!)}
                            </Radio>
                        ))}
                    </Space>
                </Radio.Group>
            </Form.Item>
        );
    }
}
