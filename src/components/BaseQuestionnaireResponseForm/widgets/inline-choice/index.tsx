import { Checkbox, Form, Radio, Space } from 'antd';
import _ from 'lodash';
import { QuestionItemProps } from 'sdc-qrf';

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from 'shared/src/contrib/aidbox';

import { getDisplay } from 'src/utils/questionnaire';

import { useFieldController } from '../../hooks';

export type InlineChoiceQuestionItem = QuestionnaireItem & {
    inlineChoiceDirection?: 'horizontal' | 'vertical';
};

interface InlineChoiceProps extends QuestionItemProps {
    questionItem: InlineChoiceQuestionItem;
}

export function InlineChoice(props: InlineChoiceProps) {
    console.log('props', props);
    const { parentPath, questionItem } = props;
    const { linkId, answerOption: answerOptionList, repeats, inlineChoiceDirection } = questionItem;

    const fieldName = repeats ? [...parentPath, linkId] : [...parentPath, linkId, 0];

    const { value, onChange, onMultiChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    if (repeats) {
        const arrayValue = (value || []) as QuestionnaireItemAnswerOption[];

        return (
            <Form.Item {...formItem} data-testid="question-inline-choice">
                <Space direction={inlineChoiceDirection ?? 'vertical'}>
                    {answerOptionList?.map((answerOption) => (
                        <Checkbox
                            checked={arrayValue.findIndex((v) => _.isEqual(v?.value, answerOption.value)) !== -1}
                            key={JSON.stringify(answerOption)}
                            disabled={disabled}
                            onChange={() => onMultiChange(answerOption)}
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
            <Form.Item {...formItem} data-testid="question-inline-choice">
                <Space direction={inlineChoiceDirection ?? 'vertical'}>
                    {answerOptionList?.map((answerOption) => (
                        <Radio
                            key={JSON.stringify(answerOption)}
                            checked={_.isEqual(value?.value, answerOption.value)}
                            disabled={disabled}
                            onChange={() => onChange(answerOption)}
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
