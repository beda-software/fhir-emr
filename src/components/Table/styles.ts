import styled, { css } from 'styled-components';

import { mobileWidth } from 'src/theme/utils';

export const S = {
    Table: styled.div<{ $showCardsOnMobile?: boolean }>`
        overflow: auto;

        ${({ $showCardsOnMobile }) =>
            $showCardsOnMobile &&
            css`
                @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
                    display: none;
                }
            `}
    `,
    Cards: styled.div<{ $showCardsOnMobile?: boolean }>`
        ${({ $showCardsOnMobile }) =>
            $showCardsOnMobile &&
            css`
                @media screen and (min-width: ${() => `${mobileWidth}px`}) {
                    display: none;
                }
            `}
    `,
};
