import { FilterDropdownProps } from 'antd/lib/table/interface';
import _ from 'lodash';

import { SearchBarColumn } from 'src/components/SearchBar/SearchBarColumn';
import { ColumnFilterValue, isSingleDateColumn, isStringColumn } from 'src/components/SearchBar/types';

import { S } from './styles';

interface Props {
    filter: ColumnFilterValue;
    onChange: (value: ColumnFilterValue['value'], key: string) => void;
}

interface TableFilterProps extends FilterDropdownProps, Props {}

export function TableFilter(props: TableFilterProps) {
    const { filter, onChange: onInitialChange, close, visible } = props;

    const onChange = (value: ColumnFilterValue['value'], key: string) => {
        if (isStringColumn(filter.column)) {
            onInitialChange(value, key);

            return;
        }

        onInitialChange(value, key);
        close();
    };

    if (isSingleDateColumn(filter.column)) {
        return (
            <S.Container>
                <S.DatePickerFilter>
                    <SearchBarColumn columnFilterValue={filter} onChange={onChange} defaultOpen={visible} />
                </S.DatePickerFilter>
            </S.Container>
        );
    }

    return (
        <S.Container>
            <S.Filter>
                <SearchBarColumn columnFilterValue={filter} onChange={onChange} defaultOpen={visible} />
            </S.Filter>
        </S.Container>
    );
}
