import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { GroupItemProps } from 'sdc-qrf';

import s from '../BuilderField/BuilderField.module.scss';

interface Props {
    children: React.ReactNode;
    item: GroupItemProps;
    activeQuestionItem?: GroupItemProps;
    onEditClick?: (item: GroupItemProps | undefined) => void;
}

export function BuilderGroup(props: Props) {
    const { children, item, activeQuestionItem, onEditClick } = props;
    const { hidden } = item.questionItem;

    if (hidden) {
        return null;
    }

    return (
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
    );
}
