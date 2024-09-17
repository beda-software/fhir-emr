import { Trans } from '@lingui/macro';
import { Button, Row } from 'antd';

import { S } from './SearchBar.styles';
import { SearchBarColumn } from './SearchBarColumn';
import { SearchBarData } from './types';

export function SearchBar(props: SearchBarData) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters, hideFilters = [] } = props;
    return (
        <S.Container>
            <Row gutter={[32, 16]}>
                {columnsFilterValues.map((columnFilterValue) => {
                    if (!hideFilters.includes(columnFilterValue.column.id)) {
                        return (
                            <SearchBarColumn
                                key={`search-bar-column-${columnFilterValue.column.id}`}
                                columnFilterValue={columnFilterValue}
                                onChange={onChangeColumnFilter}
                            />
                        );
                    }
                })}
            </Row>

            <Button onClick={onResetFilters}>
                <Trans>Reset</Trans>
            </Button>
        </S.Container>
    );
}
