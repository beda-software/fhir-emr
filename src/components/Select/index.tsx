import ReactSelect, { Props } from 'react-select';
import ReactAsyncSelect, { AsyncProps } from 'react-select/async';

import { S } from './styles';

export function Select<T>(props: Props<T>) {
    return (
        <S.Container>
            <ReactSelect classNamePrefix="react-select" {...props} />
        </S.Container>
    );
}

export function AsyncSelect<T>(props: AsyncProps<T, any, any>) {
    return (
        <S.Container>
            <ReactAsyncSelect classNamePrefix="react-select" {...props} />
        </S.Container>
    );
}
