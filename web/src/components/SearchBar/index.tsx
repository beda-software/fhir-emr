import { Trans } from '@lingui/macro';
import { Button, Row } from 'antd';

import s from './SearchBar.module.scss';
import { SearchBarColumn } from './SearchBarColumn';
import { SearchBarData, SearchBarItem } from './types';

export function SearchBar<T extends SearchBarItem>(props: SearchBarData<T>) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = props;

    return (
        <div className={s.container}>
            <Row gutter={32}>
                {columnsFilterValues.map((columnFilterValue, columnIndex) => (
                    <SearchBarColumn<T>
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
