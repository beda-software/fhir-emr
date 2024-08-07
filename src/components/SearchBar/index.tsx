import { Trans } from '@lingui/macro';
import { Button, Row } from 'antd';

import { S } from './SearchBar.styles';
import { SearchBarColumn } from './SearchBarColumn';
import { SearchBarData } from './types';

export function SearchBar(props: SearchBarData) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = props;

    return (
        <S.Container>
            <Row gutter={[32, 16]}>
                {columnsFilterValues.map((columnFilterValue) => (
                    <SearchBarColumn
                        key={`search-bar-column-${columnFilterValue.column.id}`}
                        columnFilterValue={columnFilterValue}
                        onChange={onChangeColumnFilter}
                    />
                ))}
            </Row>

            <Button onClick={onResetFilters}>
                <Trans>Reset</Trans>
            </Button>
        </S.Container>
    );
}
