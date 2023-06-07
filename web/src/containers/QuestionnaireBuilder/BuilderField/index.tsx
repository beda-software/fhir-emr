import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import { QuestionItemProps } from 'sdc-qrf';

import s from './BuilderField.module.scss';

interface Props {
    children: React.ReactNode;
    item: QuestionItemProps;
    activeQuestionItem?: QuestionItemProps;
    onEditClick?: (item: QuestionItemProps | undefined) => void;
    onItemDrag: (dropTargetItem: QuestionItemProps, dropSourceItem: QuestionItemProps) => void;
}

export function BuilderField(props: Props) {
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
                    <div className={s.panel}>
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

interface FieldSourceProps {
    children: React.ReactNode;
    item: QuestionItemProps;
}

function FieldSource(props: FieldSourceProps) {
    const { children, item } = props;

    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: 'FIELD',
            item,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
            }),
        }),
        [],
    );

    return (
        <div ref={dragRef} style={{ opacity }}>
            {children}
        </div>
    );
}

interface FieldBoardProps {
    children: React.ReactNode;
    item: QuestionItemProps;
    onItemDrag: (dropTargetItem: QuestionItemProps, dropSourceItem: QuestionItemProps) => void;
}

function FieldTarget(props: FieldBoardProps) {
    const { children, item, onItemDrag } = props;
    const [{ isOver, canDrop }, dropRef] = useDrop(
        () => ({
            accept: 'FIELD',
            drop: (dropSourceItem: QuestionItemProps) => onItemDrag(item, dropSourceItem),
            canDrop: (dropSourceItem: QuestionItemProps) =>
                dropSourceItem.questionItem.linkId !== item.questionItem.linkId,
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        [],
    );

    return (
        <div ref={dropRef} className={s.board}>
            {children}
            {canDrop ? (
                <div
                    className={classNames(s.dropArea, {
                        _over: isOver,
                    })}
                />
            ) : null}
        </div>
    );
}
