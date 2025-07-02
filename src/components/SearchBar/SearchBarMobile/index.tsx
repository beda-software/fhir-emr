import { CloseOutlined, FilterFilled } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import _ from 'lodash';
import { useState } from 'react';

import { Title } from 'src/components/Typography';

import { S } from './styles';
import { SearchBarColumn } from '../SearchBarColumn';
import { SearchBarData } from '../types';

export function SearchBarMobile(props: SearchBarData) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = props;
    const [filtersOpened, toggleFiltersOpened] = useState(false);
    const appliedFiltersCount = _.compact(columnsFilterValues.map((f) => f.value)).length;

    return (
        <S.Container>
            <S.FiltersButton>
                <Button type="default" icon={<FilterFilled />} onClick={() => toggleFiltersOpened(true)} />
                {appliedFiltersCount ? <S.Badge count={appliedFiltersCount} size="small" /> : null}
            </S.FiltersButton>
            <S.Drawer
                placement="bottom"
                onClose={() => toggleFiltersOpened(false)}
                open={filtersOpened}
                closable={false}
                width="100%"
                height="100%"
            >
                <S.DrawerHeader>
                    <Title level={5}>
                        <Trans>Filters</Trans>
                    </Title>
                    <S.CloseIcon type="text" icon={<CloseOutlined />} onClick={() => toggleFiltersOpened(false)} />
                </S.DrawerHeader>
                <S.DrawerContent>
                    {columnsFilterValues.map((columnFilterValue) => (
                        <SearchBarColumn
                            key={`search-bar-column-${columnFilterValue.column.id}`}
                            columnFilterValue={columnFilterValue}
                            onChange={onChangeColumnFilter}
                        />
                    ))}
                </S.DrawerContent>
                <S.DrawerFooter>
                    <Button type="primary" onClick={() => toggleFiltersOpened(false)} size="large">
                        <Trans>Show results</Trans>
                    </Button>
                    <Button type="default" onClick={onResetFilters} size="large">
                        <Trans>Clear filters</Trans>
                    </Button>
                </S.DrawerFooter>
            </S.Drawer>
        </S.Container>
    );
}
