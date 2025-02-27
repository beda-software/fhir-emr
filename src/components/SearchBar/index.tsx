import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { useMemo } from 'react';

import { SearchBarColumn } from './SearchBarColumn';
import { SearchBarMobile } from './SearchBarMobile';
import { S } from './styles';
import { SearchBarData } from './types';
import { isSearchBarFilter } from './utils';

interface SearchBarProps extends SearchBarData {
    showInDrawerOnMobile?: boolean;
    level?: 1 | 2;
}

export function SearchBar(props: SearchBarProps) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters, showInDrawerOnMobile = true, level = 1 } = props;
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

                {searchBarFilterValues.length > 1 ? (
                    <Button onClick={onResetFilters}>
                        <Trans>Clear filters</Trans>
                    </Button>
                ) : null}
            </S.SearchBar>
            <S.MobileFilters $showInDrawerOnMobile={showInDrawerOnMobile} $level={level}>
                <SearchBarMobile {...props} />
            </S.MobileFilters>
        </>
    );
}
