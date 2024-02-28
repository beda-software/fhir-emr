import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import _ from 'lodash';
import React, { ReactNode } from 'react';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { Paragraph } from 'src/components/Typography';

import s from './RepeatableGroups.module.scss';

interface RepeatableGroupsProps {
    groupItem: GroupItemProps;
    renderGroup?: (props: RepeatableGroupProps) => ReactNode;
}

export function RepeatableGroups(props: RepeatableGroupsProps) {
    const { groupItem, renderGroup } = props;
    const { parentPath, questionItem } = groupItem;
    const { linkId, required } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { value, onChange } = useFieldController(fieldName, questionItem);
    const items = value.items && value.items.length ? value.items : required ? [{}] : [];

    return (
        <div className={s.group}>
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
                    <RepeatableGroupDefault
                        key={index}
                        index={index}
                        value={value}
                        onChange={onChange}
                        groupItem={groupItem}
                    />
                );
            })}
            {groupItem.questionItem.readOnly ? null : (
                <div>
                    <Button
                        icon={<PlusOutlined />}
                        type="link"
                        className={s.addButton}
                        onClick={() => {
                            const existingItems = items || [];
                            const updatedInput = { items: [...existingItems, {}] };
                            onChange(updatedInput);
                        }}
                        size="small"
                    >
                        <span>
                            <Trans>Add another answer</Trans>
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
}

interface RepeatableGroupProps {
    index: number;
    value: any;
    onChange: (event: any) => void;
    groupItem: GroupItemProps;
}

function useRepeatableGroup(props: RepeatableGroupProps) {
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

export function RepeatableGroupDefault(props: RepeatableGroupProps) {
    const { index, groupItem } = props;
    const { questionItem } = groupItem;
    const { item, text } = questionItem;
    const { onRemove, parentPath, context } = useRepeatableGroup(props);

    return (
        <>
            <div className={s.groupHeader}>
                {text && <Paragraph className={s.groupTitle}>{`${questionItem.text} #${index + 1}`}</Paragraph>}
                <Button type="link" danger className={s.removeButton} onClick={onRemove} size="small">
                    <span>
                        <Trans>Remove</Trans>
                    </span>
                </Button>
            </div>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
        </>
    );
}

export function RepeatableGroupRow(props: RepeatableGroupProps) {
    const { groupItem } = props;
    const { questionItem } = groupItem;
    const { item } = questionItem;
    const { onRemove, parentPath, context } = useRepeatableGroup(props);

    return (
        <div className={s.row}>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
            <div className={s.rowControls}>
                {questionItem.readOnly ? (
                    <span style={{ width: 18 }} />
                ) : (
                    <Button
                        icon={<CloseCircleOutlined />}
                        type="link"
                        danger
                        className={s.removeButton}
                        onClick={onRemove}
                    />
                )}
            </div>
        </div>
    );
}
