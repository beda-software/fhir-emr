import ReactSelect from 'react-select';
import ReactAsyncSelect, { AsyncProps } from 'react-select/async';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

import { S } from './Select.styles';

export function Select<T>(props: StateManagerProps<T>) {
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
