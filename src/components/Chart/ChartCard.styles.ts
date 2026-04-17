import styled from 'styled-components';

export const S = {
    StateBox: styled.div<{ $minHeight: number }>`
        min-height: ${({ $minHeight }) => `${$minHeight}px`};
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
};
