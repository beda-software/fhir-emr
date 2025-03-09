import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import _ from 'lodash';
import React, { ReactNode, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { GroupItemProps } from 'sdc-qrf';

import { uuid4 } from '@beda.software/fhir-react';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { RepeatableGroupCard } from './RepeatableGroupCard';
import { RepeatableGroupRow } from './RepeatableGroupRow';
import { S } from './styles';
import { RepeatableGroupProps } from './types';
export { RepeatableGroupCard, RepeatableGroupRow };

interface RepeatableGroupsProps {
    groupItem: GroupItemProps;
    renderGroup?: (props: RepeatableGroupProps) => ReactNode;
    buildValue?: (existingItems: Array<any>) => any;
}

function defaultBuildValue(exisingItems: Array<any>) {
    return [...exisingItems, {}];
}

export function RepeatableGroups(props: RepeatableGroupsProps) {
    const { groupItem, renderGroup } = props;
    const { parentPath, questionItem } = groupItem;
    const { linkId, required, text } = questionItem;

    const fieldName = [...parentPath, linkId];
    const [key, setKey] = React.useState(uuid4());

    const { onChange: onChangeBase } = useFieldController(fieldName, questionItem);

    const onChange = useCallback(
        (value: any) => {
            setKey(uuid4());
            onChangeBase(value);
        },
        [onChangeBase],
    );

    const { getValues } = useFormContext();

    const value = _.get(getValues(), fieldName);

    const items = value?.items && value.items.length ? value.items : required ? [{}] : [];
    const buildValue = props.buildValue ?? defaultBuildValue;

    return (
        <S.Group>
            {_.map(items, (_elem, index: number) => {
                if (!items[index]) {
                    return null;
                }

                return renderGroup ? (
                    <React.Fragment key={`${fieldName.join()}-${key}`}>
                        {renderGroup({
                            index,
                            items,
                            onChange,
                            groupItem,
                        })}
                    </React.Fragment>
                ) : (
                    <RepeatableGroupCard
                        key={`${key}-${index}`}
                        index={index}
                        items={items}
                        onChange={onChange}
                        groupItem={groupItem}
                        variant="main-card"
                    />
                );
            })}
            {groupItem.questionItem.readOnly ? null : (
                <S.Footer>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        ghost
                        onClick={() => {
                            const updatedInput = { items: buildValue(items ?? []) };
                            onChange(updatedInput);
                        }}
                        size="middle"
                    >
                        <span>{text ? <Trans>Add {text}</Trans> : <Trans>Add another answer</Trans>}</span>
                    </Button>
                </S.Footer>
            )}
        </S.Group>
    );
}
