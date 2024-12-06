import { Table as ANTDTable } from 'antd';
import { TableProps } from 'antd/lib/table';

import { S } from './styles';

export function Table<T extends object>(props: TableProps<T>) {
    return (
        <S.Table>
            <ANTDTable<T> bordered size="middle" {...props} />
        </S.Table>
    );
}
