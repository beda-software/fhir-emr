import Sider from 'antd/es/layout/Sider';
import styled from 'styled-components';

import { mobileWidth } from 'src/theme/utils';

export const S = {
    Sider: styled(Sider)`
        height: 100%;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        border-right: 1px solid ${({ theme }) => theme.neutral.dividers};
        z-index: 900;
    `,
    ChartingPanel: styled.div`
        position: relative;

        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            display: none;
        }
    `,
    ChartingPanelTogglerWrapper: styled.div<{ $chartingPanelActive: boolean }>`
        position: absolute;
        right: 0;
    `,
    ChartingPanelToggler: styled.div<{ $chartingPanelActive: boolean }>`
        position: fixed;
        top: 50%;
        margin-left: -1px;
        transform: translateY(-50%);
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
