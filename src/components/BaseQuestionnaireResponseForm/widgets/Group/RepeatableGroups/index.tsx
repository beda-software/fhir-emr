import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import _ from 'lodash';
import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { GroupItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { RepeatableGroupCard } from './RepeatableGroupCard';
import { RepeatableGroupRow } from './RepeatableGroupRow';
import { S } from './styles';
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
    const { onChange } = useFieldController(fieldName, questionItem);

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
                    <React.Fragment key={`${fieldName.join()}-${index}`}>
                        {renderGroup({
                            index,
                            value,
                            onChange,
                            groupItem,
                        })}
                    </React.Fragment>
                ) : (
                    <RepeatableGroupCard
                        key={index}
                        index={index}
                        value={value}
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

export interface RepeatableGroupProps {
    index: number;
    value: any;
    onChange: (event: any) => void;
    groupItem: GroupItemProps;
}

export function useRepeatableGroup(props: RepeatableGroupProps) {
    const { index, value, onChange, groupItem } = props;
    const { parentPath, questionItem, context } = groupItem;
    const { linkId } = questionItem;

    const onRemove = () => {
        const filteredArray = _.filter(value.items, (_val, valIndex: number) => valIndex !== index);
        onChange({
            items: [...filteredArray],
        });
    };

    return {
        onRemove,
        parentPath: [...parentPath, linkId, 'items', index.toString()],
        context: context[0]!,
    };
}
