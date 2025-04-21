import styled from 'styled-components';

import { mobileWidth } from 'src/theme/utils';

export const S = {
    ChartingPanel: styled.div`
        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            display: none;
        }
    `,
    ChartingPanelToggler: styled.div<{ $chartingPanelActive: boolean }>`
        position: fixed;
        top: 50%;
        left: ${({ $chartingPanelActive }) => ($chartingPanelActive ? 319 : 79)}px;
        width: 18px;
        height: 48px;
        background: ${({ theme }) => theme.neutralPalette.gray_1};
        color: ${({ theme }) => theme.neutral.title};
        border-radius: 0 6px 6px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        border-top: 1px solid ${({ theme }) => theme.neutral.dividers};
        border-right: 1px solid ${({ theme }) => theme.neutral.dividers};
        border-bottom: 1px solid ${({ theme }) => theme.neutral.dividers};
    `,
};
