import { Table as ANTDTable } from 'antd';
import { TableProps } from 'antd/lib/table';

import s from './Table.module.scss';
import './table.scss';

export function Table<T extends object>(props: TableProps<T>) {
    return (
        <div className={s.container}>
            <ANTDTable<T> className={s.table} bordered {...props} />
        </div>
    );
}
