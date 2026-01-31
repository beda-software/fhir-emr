import { Checkbox, Form, Radio, Space } from 'antd';
import _ from 'lodash';
import { FormAnswerItems, QuestionItemProps, toAnswerValue } from 'sdc-qrf';

import { getDisplay } from 'src/utils/questionnaire';

import { useFieldController } from '../../hooks';

export function InlineChoice(props: QuestionItemProps) {
    const { parentPath, questionItem } = props;
    const {
        linkId,
        answerOption: answerOptionList,
        repeats,
        choiceOrientation = 'vertical',
        colsNumber,
    } = questionItem;

    const fieldName = [...parentPath, linkId];

    const { value, onChange, onMultiChange, disabled, formItem } = useFieldController<FormAnswerItems[]>(
        fieldName,
        questionItem,
    );

    const formAnswers = value || [];

    const styles: React.CSSProperties = colsNumber
        ? {
              width: '100%',
              display: 'grid',
              gridTemplateColumns: `repeat(${colsNumber}, 1fr)`,
          }
        : {};

    if (repeats) {
        return (
            <Form.Item {...formItem} data-testid={linkId} data-linkid={linkId}>
                <Space direction={choiceOrientation} wrap style={styles}>
                    {answerOptionList?.map((answerOption) => {
                        const optionAnswerValue = toAnswerValue(answerOption, 'value')!;

                        return (
                            <Checkbox
                                checked={formAnswers.findIndex((v) => _.isEqual(v.value, optionAnswerValue)) !== -1}
                                key={JSON.stringify(optionAnswerValue)}
                                disabled={disabled}
                                onChange={() => onMultiChange({ value: optionAnswerValue })}
                                // TODO: use linkId + __ + code instead
                                data-testid={`inline-choice__${_.kebabCase(
                                    JSON.stringify(getDisplay(optionAnswerValue)),
                                )}`}
                            >
                                {getDisplay(optionAnswerValue)}
                            </Checkbox>
                        );
                    })}
                </Space>
            </Form.Item>
        );
    } else {
        return (
            <Form.Item {...formItem} data-testid={linkId} data-linkid={linkId}>
                <Space direction={choiceOrientation} wrap style={styles}>
                    {answerOptionList?.map((answerOption) => {
                        const optionAnswerValue = toAnswerValue(answerOption, 'value');

                        return (
                            <Radio
                                key={JSON.stringify(optionAnswerValue)}
                                checked={formAnswers.findIndex((v) => _.isEqual(v.value, optionAnswerValue)) !== -1}
                                disabled={disabled}
                                onChange={() => onChange([{ value: optionAnswerValue }])}
                                // TODO: use linkId + __ + code instead
                                data-testid={`inline-choice__${_.kebabCase(
                                    JSON.stringify(getDisplay(optionAnswerValue)),
                                )}`}
                            >
                                {getDisplay(optionAnswerValue)}
                            </Radio>
                        );
                    })}
                </Space>
            </Form.Item>
        );
    }
}
