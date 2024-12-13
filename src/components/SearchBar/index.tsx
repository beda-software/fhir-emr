import { Trans } from '@lingui/macro';
import { Button } from 'antd';

import { SearchBarColumn } from './SearchBarColumn';
import { S } from './styles';
import { SearchBarData } from './types';
import { SearchBarMobile } from './SearchBarMobile';

interface SearchBarProps extends SearchBarData {
    showInDrawerOnMobile?: boolean;
}

export function SearchBar(props: SearchBarProps) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters, showInDrawerOnMobile = true } = props;

    return (
        <>
            <S.SearchBar $showInDrawerOnMobile={showInDrawerOnMobile}>
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
            </S.SearchBar>
            <S.MobileFilters $showInDrawerOnMobile={showInDrawerOnMobile}>
                <SearchBarMobile {...props} />
            </S.MobileFilters>
        </>
    );
}
