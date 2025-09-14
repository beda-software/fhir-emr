import styled, { css } from 'styled-components';

export const S = {
    Group: styled.div<{ $active: boolean }>`
        display: none;
        flex-direction: column;
        gap: inherit;
        flex: 1;

        ${({ $active }) =>
            $active &&
            css`
                display: flex;
            `}
    `,
};
