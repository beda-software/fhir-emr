import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import s from './BuilderField.module.scss';

interface Props {
    children: React.ReactNode;
    item: QuestionItemProps;
    onQuestionnaireItemClick?: (item: QuestionItemProps | undefined) => void;
}

export function BuilderField(props: Props) {
    const { children, item, onQuestionnaireItemClick } = props;
    const { hidden } = item.questionItem;

    if (hidden) {
        return null;
    }

    return (
        <div className={classNames(s.container)}>
            <div className={s.panel}>
                <Button type="text" className={s.button} onClick={() => onQuestionnaireItemClick?.(item)}>
                    <SettingOutlined />
                </Button>
            </div>
            {children}
        </div>
    );
}
