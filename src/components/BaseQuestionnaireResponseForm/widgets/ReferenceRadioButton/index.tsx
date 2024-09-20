import { Form, Radio, Space } from 'antd';
import { Resource } from 'fhir/r4b';
import _ from 'lodash';

import { getDisplay } from 'src/utils';

import { useReferenceRadioButton } from './hooks';
import { AnswerReferenceProps } from '../reference';

function ReferenceRadioButtonUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem } = props;
    const { choiceOrientation = 'vertical' } = questionItem;

    const { loadedOptions, fieldController } = useReferenceRadioButton(props);

    const { formItem, value, onChange, disabled } = fieldController;

    return loadedOptions ? (
        <Form.Item {...formItem}>
            <Space direction={choiceOrientation}>
                {loadedOptions.map((answerOption) => (
                    <Radio
                        key={JSON.stringify(answerOption)}
                        checked={_.isEqual(value?.value, answerOption.value)}
                        disabled={disabled}
                        onChange={() => onChange(answerOption)}
                        data-testid={`inline-choice__${_.kebabCase(JSON.stringify(getDisplay(answerOption.value)))}`}
                    >
                        {getDisplay(answerOption.value)}
                    </Radio>
                ))}
            </Space>
        </Form.Item>
    ) : null;
}

export function ReferenceRadioButton<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { answerExpression, choiceColumn, linkId } = props.questionItem;

    if (!answerExpression || !choiceColumn) {
        console.warn(`answerExpression and choiceColumn must be set for linkId '${linkId}'`);
        return null;
    }

    return <ReferenceRadioButtonUnsafe {...props} />;
}
