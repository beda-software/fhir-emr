import { Table as ANTDTable } from 'antd';
import { TableProps } from 'antd/lib/table';

import s from './Table.module.scss';

export function Table<T extends object>(props: TableProps<T>) {
    return <ANTDTable<T> className={s.table} bordered {...props} />;
}
