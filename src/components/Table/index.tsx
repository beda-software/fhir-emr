import { Table as ANTDTable } from 'antd';
import { TableProps as ANTDTableProps } from 'antd/lib/table';

import { S } from './styles';
import { TableCards } from './TableCards';
import './table.scss';

interface TableProps<T> extends ANTDTableProps<T> {
    showCardsOnMobile?: boolean;
}

export function Table<T extends object>(props: TableProps<T>) {
    const { showCardsOnMobile = true } = props;

    return (
        <>
            <S.Table $showCardsOnMobile={showCardsOnMobile}>
                <ANTDTable<T> bordered size="middle" {...props} />
            </S.Table>
            <S.Cards $showCardsOnMobile={showCardsOnMobile}>
                <TableCards {...props} />
            </S.Cards>
        </>
    );
}
