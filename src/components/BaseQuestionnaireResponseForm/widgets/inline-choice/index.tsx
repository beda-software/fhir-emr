import { Checkbox, Form, Radio, Space } from 'antd';
import _ from 'lodash';
import { QuestionItemProps } from 'sdc-qrf';

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '@beda.software/aidbox-types';

import { getDisplay } from 'src/utils/questionnaire';

import { useFieldController } from '../../hooks';

interface InlineChoiceProps extends QuestionItemProps {
    questionItem: QuestionnaireItem;
}

export function InlineChoice(props: InlineChoiceProps) {
    const { parentPath, questionItem } = props;
    const { linkId, answerOption: answerOptionList, repeats, choiceOrientation = 'vertical' } = questionItem;

    const fieldName = [...parentPath, linkId];

    const { value, onChange, onMultiChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    const arrayValue = (value || []) as QuestionnaireItemAnswerOption[];

    if (repeats) {
        return (
            <Form.Item {...formItem} data-testid={linkId}>
                <Space direction={choiceOrientation}>
                    {answerOptionList?.map((answerOption) => (
                        <Checkbox
                            checked={arrayValue.findIndex((v) => _.isEqual(v?.value, answerOption.value)) !== -1}
                            key={JSON.stringify(answerOption)}
                            disabled={disabled}
                            onChange={() => onMultiChange(answerOption)}
                            // TODO: use linkId + __ + code instead
                            data-testid={`inline-choice__${_.kebabCase(
                                JSON.stringify(getDisplay(answerOption.value!)),
                            )}`}
                        >
                            {getDisplay(answerOption.value!)}
                        </Checkbox>
                    ))}
                </Space>
            </Form.Item>
        );
    } else {
        return (
            <Form.Item {...formItem} data-testid={linkId}>
                <Space direction={choiceOrientation}>
                    {answerOptionList?.map((answerOption) => (
                        <Radio
                            key={JSON.stringify(answerOption)}
                            checked={arrayValue.findIndex((v) => _.isEqual(v?.value, answerOption.value)) !== -1}
                            disabled={disabled}
                            onChange={() => onChange([answerOption])}
                            // TODO: use linkId + __ + code instead
                            data-testid={`inline-choice__${_.kebabCase(
                                JSON.stringify(getDisplay(answerOption.value!)),
                            )}`}
                        >
                            {getDisplay(answerOption.value!)}
                        </Radio>
                    ))}
                </Space>
            </Form.Item>
        );
    }
}
