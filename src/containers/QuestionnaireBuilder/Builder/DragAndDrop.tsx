import classNames from 'classnames';
import { useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf';

import s from './Builder.module.scss';
import { S } from './Builder.styles';
import { FieldSourceContext } from '../context';
import { OnItemDrag } from '../hooks';

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
                    setMoving?.('up');
                }

                if (coords && coords.y > 0) {
                    setMoving?.('down');
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
                <S.DropArea
                    className={classNames({
                        _over: isOver,
                        _up: true,
                    })}
                    style={{ marginBottom: 16 }}
                />
            ) : null}
            {children}
            {moving === 'down' ? (
                <S.DropArea
                    className={classNames({
                        _over: isOver,
                        _down: true,
                    })}
                    style={{ marginTop: 16 }}
                />
            ) : null}
        </div>
    );
}
