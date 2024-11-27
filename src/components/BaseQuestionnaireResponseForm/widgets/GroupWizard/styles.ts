import styled, { css } from 'styled-components';

import { FormFooter } from '../../FormFooter';

export const S = {
    Group: styled.div<{ $active: boolean }>`
        display: none;
        flex-direction: column;
        gap: inherit;

        ${({ $active }) =>
            $active &&
            css`
                display: flex;
            `}
    `,
    FormFooter: styled(FormFooter)`
        padding: 0;
        margin: 0;
    `,
};
