import { Trans } from '@lingui/macro';
import { Button } from 'antd';

import { SearchBarColumn } from './SearchBarColumn';
import { S } from './styles';
import { SearchBarData } from './types';
import { SearchBarMobile } from './SearchBarMobile';
import { isSearchBarFilter } from './utils';
import { useMemo } from 'react';

interface SearchBarProps extends SearchBarData {
    showInDrawerOnMobile?: boolean;
}

export function SearchBar(props: SearchBarProps) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters, showInDrawerOnMobile = true } = props;
    const searchBarFilterValues = useMemo(
        () => columnsFilterValues.filter((filter) => isSearchBarFilter(filter)),
        [JSON.stringify(columnsFilterValues)],
    );

    return (
        <>
            <S.SearchBar $showInDrawerOnMobile={showInDrawerOnMobile}>
                <S.LeftColumn>
                    {searchBarFilterValues.map((columnFilterValue) => (
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
            </S.SearchBar>
            <S.MobileFilters $showInDrawerOnMobile={showInDrawerOnMobile}>
                <SearchBarMobile {...props} />
            </S.MobileFilters>
        </>
    );
}
