import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { GroupItemProps } from 'sdc-qrf';

import { OnItemDrag } from '../hooks';
import s from './Builder.module.scss';
import { FieldSource, FieldTarget } from './DragAndDrop';

interface Props {
    children: React.ReactNode;
    item: GroupItemProps;
    activeQuestionItem?: GroupItemProps;
    onEditClick?: (item: GroupItemProps | undefined) => void;
    onItemDrag: (props: OnItemDrag) => void;
}

export function BuilderGroup(props: Props) {
    const { children, item, activeQuestionItem, onEditClick, onItemDrag } = props;
    const { hidden } = item.questionItem;

    if (hidden) {
        return null;
    }

    return (
        <FieldTarget item={item} onItemDrag={onItemDrag}>
            <FieldSource item={item}>
                <div
                    className={classNames(s.container, {
                        _active: item.questionItem.linkId === activeQuestionItem?.questionItem.linkId,
                    })}
                >
                    <div className={s.toolBox}>
                        <Button type="text" className={s.button} onClick={() => onEditClick?.(item)}>
                            <SettingOutlined />
                        </Button>
                    </div>
                    {children}
                </div>
            </FieldSource>
        </FieldTarget>
    );
}
