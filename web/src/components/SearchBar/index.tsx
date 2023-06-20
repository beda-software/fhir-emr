import { Trans } from '@lingui/macro';
import { Button, Row } from 'antd';

import s from './SearchBar.module.scss';
import { SearchBarColumn } from './SearchBarColumn';
import { SearchBarData } from './types';

export function SearchBar(props: SearchBarData) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = props;

    return (
        <div className={s.container}>
            <Row gutter={[32, 16]}>
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
