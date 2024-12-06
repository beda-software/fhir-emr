import { Trans } from '@lingui/macro';
import { Button } from 'antd';

import { SearchBarColumn } from './SearchBarColumn';
import { S } from './styles';
import { SearchBarData } from './types';

export function SearchBar(props: SearchBarData) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = props;

    return (
        <S.Container>
            <S.LeftColumn>
                {columnsFilterValues.map((columnFilterValue) => (
                    <SearchBarColumn
                        key={`search-bar-column-${columnFilterValue.column.id}`}
                        columnFilterValue={columnFilterValue}
                        onChange={onChangeColumnFilter}
                    />
                ))}
            </S.LeftColumn>

            <Button onClick={onResetFilters}>
                <Trans>Clear filters</Trans>
            </Button>
        </S.Container>
    );
}
