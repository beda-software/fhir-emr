import styled, { css, DefaultTheme } from 'styled-components';

import { Title } from '../Typography';

const getStepBackgroundColorActive = (theme: DefaultTheme, status?: 'finish' | 'process' | 'wait' | 'error') => {
    switch (status) {
        case 'finish':
            return theme.secondaryPalette.bcs_6;
        case 'process':
            return theme.primaryPalette.bcp_6;
        case 'wait':
            return theme.primaryPalette.bcp_1;
        case 'error':
            return theme.error;
        default:
            return theme.primaryPalette.bcp_1;
    }
};

const getStepBackgroundColorInactive = (theme: DefaultTheme, status?: 'finish' | 'process' | 'wait' | 'error') => {
    switch (status) {
        case 'finish':
            return theme.secondaryPalette.bcs_4;
        case 'process':
            return theme.primaryPalette.bcp_4;
        case 'wait':
            return theme.primaryPalette.bcp_1;
        case 'error':
            return theme.error;
        default:
            return theme.primaryPalette.bcp_1;
    }
};

const getStepBorderColorActive = (theme: DefaultTheme, status?: 'finish' | 'process' | 'wait' | 'error') => {
    switch (status) {
        case 'finish':
            return theme.secondaryPalette.bcs_6;
        case 'process':
            return theme.primaryPalette.bcp_6;
        case 'wait':
            return theme.primaryPalette.bcp_1;
        case 'error':
            return theme.error;
        default:
            return theme.primaryPalette.bcp_1;
    }
};

const getStepIconColorInactive = (theme: DefaultTheme, status?: 'finish' | 'process' | 'wait' | 'error') => {
    switch (status) {
        case 'finish':
            return theme.neutralPalette.gray_1;
        case 'process':
            return theme.neutralPalette.gray_1;
        case 'wait':
            return theme.neutralPalette.gray_13;
        case 'error':
            return theme.neutralPalette.gray_1;
        default:
            return theme.neutralPalette.gray_13;
    }
};

export const S = {
    Container: styled.div<{ $labelPlacement: 'vertical' | 'tooltip' }>`
        display: flex;
        flex-direction: column;
        gap: 24px 0;

        .ant-steps {
            overflow-x: auto;
            scrollbar-width: thin;
        }

        .ant-steps-item-tail:after {
            background-color: ${({ theme }) => theme.neutralPalette.gray_4} !important;
        }

        .ant-steps-item-title {
            font-size: 14px;
            line-height: 24px;
            color: ${({ theme }) => theme.neutral.primaryText} !important;
        }

        ${({ $labelPlacement }) =>
            $labelPlacement === 'tooltip' &&
            css`
                .ant-steps-item-content {
                    width: 0 !important;
                    margin-top: 0 !important;
                }

                .ant-steps-item-icon {
                    margin-inline-start: 0 !important;
                }

                .ant-steps-item-tail {
                    margin-inline-start: 16px !important;
                }
            `}
    `,
    Title: styled(Title)`
        margin-bottom: 0 !important;
    `,
    Icon: styled.div<{ $active: boolean; $status?: 'wait' | 'process' | 'finish' | 'error' }>`
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${({ theme }) => theme.primaryPalette.bcp_1};
        transition: all 0.2s;

        .ant-steps-item-container[role='button']:hover & {
            background-color: ${({ theme, $status }) => getStepBackgroundColorActive(theme, $status)};
            border-color: ${({ theme, $status }) => getStepBorderColorActive(theme, $status)};
        }

        ${({ $status, $active }) =>
            !$active &&
            css`
                background-color: ${({ theme }) => getStepBackgroundColorInactive(theme, $status)};
                border-color: ${({ theme }) => {
                    return theme.neutralPalette.gray_1;
                }};

                * {
                    color: ${({ theme }) => getStepIconColorInactive(theme, $status)};
                }
            `}

        ${({ $active, $status }) =>
            $active &&
            css`
                background-color: ${({ theme }) => getStepBackgroundColorActive(theme, $status)};
                border-color: ${({ theme }) => getStepBorderColorActive(theme, $status)};

                * {
                    color: ${({ theme }) => theme.neutralPalette.gray_1};
                }
            `}
    `,
    Footer: styled.div`
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
    `,
    ControlsLeft: styled.div`
        display: flex;
        gap: 0 8px;
    `,
    ControlsRight: styled.div`
        display: flex;
        gap: 0 8px;
    `,
};
