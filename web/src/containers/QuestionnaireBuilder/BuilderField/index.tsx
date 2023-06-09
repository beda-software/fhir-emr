import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf';

import { FieldSourceContext } from '../context';
import { OnItemDrag } from '../hooks';
import s from './BuilderField.module.scss';

interface Props {
    children: React.ReactNode;
    item: QuestionItemProps;
    activeQuestionItem?: QuestionItemProps;
    onEditClick?: (item: QuestionItemProps | undefined) => void;
    onItemDrag: (props: OnItemDrag) => void;
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
                    style={{ paddingBottom: 0 }}
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

interface FieldSourceProps {
    children: React.ReactNode;
    item: QuestionItemProps | GroupItemProps;
}

export function FieldSource(props: FieldSourceProps) {
    const { children, item } = props;

    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: 'FIELD',
            item,
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [],
    );

    return (
        <div
            ref={dragRef}
            className={classNames(s.dragArea, {
                _dragging: isDragging,
            })}
        >
            {children}
        </div>
    );
}

export interface FieldTargetProps {
    children: React.ReactNode;
    item: QuestionItemProps | GroupItemProps;
    onItemDrag: (props: OnItemDrag) => void;
}

export function useFieldTarget(props: FieldTargetProps) {
    const { item, onItemDrag } = props;
    const { moving, setMoving } = useContext(FieldSourceContext);
    const [{ isOver }, dropRef] = useDrop(
        () => ({
            accept: 'FIELD',
            drop: (dropSourceItem: QuestionItemProps, monitor) => {
                const didDrop = monitor.didDrop();

                if (dropSourceItem.questionItem.linkId === item.questionItem.linkId) {
                    return;
                }

                if (!didDrop) {
                    onItemDrag({ dropSourceItem, dropTargetItem: item, place: moving === 'up' ? 'before' : 'after' });
                }
            },
            hover: (_, monitor) => {
                const coords = monitor.getDifferenceFromInitialOffset();
                if (coords && coords.y < 0) {
                    setMoving('up');
                }

                if (coords && coords.y > 0) {
                    setMoving('down');
                }
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver({ shallow: true }),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        [],
    );

    return { moving, isOver, dropRef };
}

export function FieldTarget(props: FieldTargetProps) {
    const { children } = props;
    const { moving, isOver, dropRef } = useFieldTarget(props);

    return (
        <div ref={dropRef} className={s.board}>
            {moving === 'up' ? (
                <div
                    className={classNames(s.dropArea, {
                        _over: isOver,
                        _up: true,
                    })}
                    style={{ marginBottom: 16 }}
                />
            ) : null}
            {children}
            {moving === 'down' ? (
                <div
                    className={classNames(s.dropArea, {
                        _over: isOver,
                        _down: true,
                    })}
                    style={{ marginTop: 16 }}
                />
            ) : null}
        </div>
    );
}
