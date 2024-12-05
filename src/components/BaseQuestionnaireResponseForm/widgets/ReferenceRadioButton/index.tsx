import { Form, Radio, Space } from 'antd';
import { Resource } from 'fhir/r4b';
import _ from 'lodash';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { Text } from 'src/components/Typography';
import { getDisplay } from 'src/utils';

import { AnswerReferenceProps, useAnswerReference } from '../reference';

function ReferenceRadioButtonUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem } = props;
    const { choiceOrientation = 'vertical' } = questionItem;

    const { optionsRD, fieldController } = useAnswerReference(props);

    const { formItem, value, onSelect, disabled } = fieldController;

    return (
        <RenderRemoteData
            remoteData={optionsRD}
            renderLoading={Spinner}
            renderFailure={(error) => <Text>{formatError(error)}</Text>}
        >
            {(options) => (
                <Form.Item {...formItem}>
                    <Space direction={choiceOrientation}>
                        {options.map((answerOption) => (
                            <Radio
                                key={JSON.stringify(answerOption)}
                                checked={_.isEqual(value?.value, answerOption.value)}
                                disabled={disabled}
                                onChange={() => onSelect(answerOption)}
                                data-testid={`inline-choice__${_.kebabCase(
                                    JSON.stringify(getDisplay(answerOption.value)),
                                )}`}
                            >
                                {getDisplay(answerOption.value)}
                            </Radio>
                        ))}
                    </Space>
                </Form.Item>
            )}
        </RenderRemoteData>
    );
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
