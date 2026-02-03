import { Space } from 'antd';
import { ReactElement, isValidElement } from 'react';

import { S } from './styles';

export interface TitleDetailsItemProps {
    key: string;
    icon?: ReactElement;
    value?: string | ReactElement | undefined;
}

export function TitleDetailsItem(props: TitleDetailsItemProps) {
    const { key, icon, value } = props;

    return (
        <Space size={8} key={key}>
            {icon && <S.HeaderIcon>{icon}</S.HeaderIcon>}
            {value && isValidElement(value) ? value : <S.HeaderText>{value}</S.HeaderText>}
        </Space>
    );
}
