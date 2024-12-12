import styled, { css } from 'styled-components';

import { Title } from '../Typography';

export const S = {
    Container: styled.div<{ $labelPlacement: 'vertical' | 'tooltip' }>`
        display: flex;
        flex-direction: column;
        gap: 24px 0;

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
        background-color: ${({ theme }) => theme.primaryPalette.bcp_1};
        transition: all 0.2s;

        .ant-steps-item-container[role='button']:hover & {
            border-color: ${({ theme }) => theme.primaryPalette.bcp_6};
        }

        ${({ $status, $active }) =>
            $status === 'error' &&
            !$active &&
            css`
                background-color: ${({ theme }) => theme.error};
                border-color: ${({ theme }) => theme.error};

                * {
                    color: #fff;
                }

                .ant-steps-item-container[role='button']:hover & {
                    border-color: ${({ theme }) => theme.antdTheme?.red6};
                    background-color: ${({ theme }) => theme.antdTheme?.red6};
                }
            `}

        ${({ $active }) =>
            $active &&
            css`
                background-color: ${({ theme }) => theme.primaryPalette.bcp_6};
                border-color: ${({ theme }) => theme.primaryPalette.bcp_6};

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
