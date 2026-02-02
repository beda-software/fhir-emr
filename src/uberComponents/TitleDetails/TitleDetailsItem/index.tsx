import { ManOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { Resource } from 'fhir/r4b';
import { ReactElement, ReactNode, isValidElement } from 'react';

import { WithId } from '@beda.software/fhir-react';

import { RecordType } from 'src/uberComponents/ResourceListPage/types';

import { S } from './styles';

export interface TitleDetailsItemProps<R extends Resource> {
    key: string;
    icon?: ReactElement;
    getValue?: (record: RecordType<WithId<R>>) => string | ReactNode | undefined;
    context: RecordType<WithId<R>>;
}

export function TitleDetailsItem<R extends Resource>(props: TitleDetailsItemProps<R>) {
    const { key, icon, getValue, context } = props;

    const value = getValue ? getValue(context) : undefined;

    return (
        <Space size={8} key={key}>
            <ManOutlined />
            {icon && <S.HeaderIcon>{icon}</S.HeaderIcon>}
            {value && isValidElement(value) ? value : <S.HeaderText>{value}</S.HeaderText>}
        </Space>
    );
}
