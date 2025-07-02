import styled, { css } from 'styled-components';

import { mobileWidth } from 'src/theme/utils';

export const S = {
    Header: styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0 40px;
        position: relative;
    `,
    HeaderLeftColumn: styled.div``,
    HeaderRightColumn: styled.div<{ $hasFilters: boolean }>`
        display: flex;
        align-items: center;
        gap: 0 8px;

        ${({ $hasFilters }) =>
            $hasFilters &&
            css`
                @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
                    padding-right: 48px;
                }
            `}
    `,
};
