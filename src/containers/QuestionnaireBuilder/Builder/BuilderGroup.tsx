import { SettingOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { GroupItemProps } from 'sdc-qrf';

import s from './Builder.module.scss';
import { S } from './Builder.styles';
import { FieldSource, FieldTarget } from './DragAndDrop';
import { OnItemDrag } from '../hooks';

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
                <S.Container
                    className={classNames({
                        _active: item.questionItem.linkId === activeQuestionItem?.questionItem.linkId,
                    })}
                >
                    <div className={s.toolBox}>
                        {onEditClick && (
                            <S.Button type="text" onClick={() => onEditClick(item)}>
                                <SettingOutlined />
                            </S.Button>
                        )}
                    </div>
                    {children}
                </S.Container>
            </FieldSource>
        </FieldTarget>
    );
}
