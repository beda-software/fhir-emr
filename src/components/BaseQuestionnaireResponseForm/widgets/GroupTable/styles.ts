import styled, { css } from 'styled-components';

export const S = {
    ChartItem: styled.div<{ $chartHeight?: number }>`
        width: 100%;
        height: 273px;
        display: flex;
        justify-content: center;
        align-items: center;

        ${({ $chartHeight }) =>
            $chartHeight &&
            css`
                height: ${$chartHeight}px;
            `}
    `,
};
