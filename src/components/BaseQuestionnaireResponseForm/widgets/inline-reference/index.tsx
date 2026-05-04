import { Checkbox, Form, Radio, Space } from 'antd';
import { Resource } from 'fhir/r4b';
import _ from 'lodash';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { Text } from 'src/components/Typography';
import { getDisplay } from 'src/utils';

import { AnswerReferenceProps, useAnswerReference } from '../reference';

function InlineReferenceUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem } = props;
    const { choiceOrientation = 'vertical', repeats } = questionItem;

    const { optionsRD, fieldController } = useAnswerReference(props);

    const { formItem, value, onSelect, onMultiChange, disabled } = fieldController;

    return (
        <Form.Item
            {...formItem}
            data-testid={repeats ? 'reference-checkbox-button' : 'reference-radio-button'}
            data-linkid={questionItem.linkId}
        >
            <RenderRemoteData
                remoteData={optionsRD}
                renderLoading={Spinner}
                renderFailure={(error) => <Text>{formatError(error)}</Text>}
            >
                {(options) => (
                    <Space direction={choiceOrientation}>
                        {options.map((answerOption) =>
                            repeats ? (
                                <Checkbox
                                    key={JSON.stringify(answerOption)}
                                    checked={!!value?.find((v) => _.isEqual(v.value, answerOption.value))}
                                    disabled={disabled}
                                    onChange={() => onMultiChange(answerOption)}
                                >
                                    {getDisplay(answerOption.value)}
                                </Checkbox>
                            ) : (
                                <Radio
                                    key={JSON.stringify(answerOption)}
                                    checked={!!value?.find((v) => _.isEqual(v.value, answerOption.value))}
                                    disabled={disabled}
                                    onChange={() => onSelect(answerOption)}
                                    data-testid={`inline-choice__${_.kebabCase(
                                        JSON.stringify(getDisplay(answerOption.value)),
                                    )}`}
                                >
                                    {getDisplay(answerOption.value)}
                                </Radio>
                            ),
                        )}
                    </Space>
                )}
            </RenderRemoteData>
        </Form.Item>
    );
}

export function InlineReference<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { answerExpression, choiceColumn, linkId } = props.questionItem;

    if (!answerExpression || !choiceColumn) {
        console.warn(`answerExpression and choiceColumn must be set for linkId '${linkId}'`);
        return null;
    }

    return <InlineReferenceUnsafe {...props} />;
}
