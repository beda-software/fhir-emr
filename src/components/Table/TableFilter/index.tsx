import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { SearchBarColumn } from 'src/components/SearchBar/SearchBarColumn';
import { S } from './styles';
import { FilterDropdownProps } from 'antd/lib/table/interface';

interface Props extends FilterDropdownProps {
    filter: ColumnFilterValue;
    onChange: (value: ColumnFilterValue['value'], key: string) => void;
}

export function TableFilter(props: Props) {
    const { filter, onChange, close } = props;

    return (
        <S.Filter>
            <SearchBarColumn
                columnFilterValue={filter}
                onChange={(value, key) => {
                    onChange(value, key);
                    close();
                }}
            />
        </S.Filter>
    );
}
