import { Trans } from '@lingui/macro';
import { Button, Row } from 'antd';

import { sharedAuthorizedUser } from 'src/sharedState';
import { Role } from 'src/utils';

import { S } from './SearchBar.styles';
import { SearchBarColumn } from './SearchBarColumn';
import { SearchBarData } from './types';

export function SearchBar(props: SearchBarData) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = props;
    const user = sharedAuthorizedUser.getSharedState();
    
    return (
        <S.Container>
            <Row gutter={[32, 16]}>
                {columnsFilterValues
                    .filter((value) => {
                        if (
                            user?.role?.some((role) => role.name === Role.Practitioner) &&
                            value.column.id === 'practitioner'
                        ) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                    .map((columnFilterValue) => (
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
