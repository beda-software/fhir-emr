import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import _ from 'lodash';
import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { GroupItemProps, getItemKey, populateItemKey } from 'sdc-qrf';

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
    const { groupItem, renderGroup, buildValue = defaultBuildValue } = props;
    const { parentPath, questionItem } = groupItem;
    const { linkId, text } = questionItem;

    const fieldName = [...parentPath, linkId];

    const { onChange } = useFieldController(fieldName, questionItem);

    const { getValues } = useFormContext();

    const value = _.get(getValues(), fieldName);

    const populateValue = (exisingItems: Array<any>) => (buildValue(exisingItems) || []).map(populateItemKey);

    const items = value?.items || [];

    return (
        <S.Group>
            {_.map(items, (item, index: number) => {
                if (!items[index]) {
                    return null;
                }

                const key = getItemKey(item);

                return renderGroup ? (
                    <React.Fragment key={key}>
                        {renderGroup({
                            index,
                            items,
                            onChange,
                            groupItem,
                        })}
                    </React.Fragment>
                ) : (
                    <RepeatableGroupCard
                        key={key}
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
                            const updatedInput = { ...value, items: populateValue(items ?? []) };
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
