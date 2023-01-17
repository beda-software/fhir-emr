import { Button, Row } from 'antd';
import { Trans } from '@lingui/macro';

import { SearchBarColumn } from './SearchBarColumn';
import { SearchBarData, SearchBarItem } from './types';
import s from './SearchBar.module.scss';

export function SearchBar<T extends SearchBarItem>(props: SearchBarData<T>) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = props;

    return (
        <div className={s.container}>
            <Row gutter={32}>
                {columnsFilterValues.map((columnFilterValue, columnIndex) => (
                    <SearchBarColumn
                        key={`search-bar-column-${columnIndex}`}
                        columnFilterValue={columnFilterValue}
                        onChange={onChangeColumnFilter}
                    />
                ))}
            </Row>

            <Button onClick={onResetFilters}>
                <Trans>Reset</Trans>
            </Button>
        </div>
    );
}
