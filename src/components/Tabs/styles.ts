import styled, { css } from 'styled-components';

export const S = {
    Tabs: styled.div<{ $boxShadow?: boolean }>`
        .ant-tabs-nav {
            margin-bottom: 0;

            &:before {
                border-bottom-width: 0;

                ${({ $boxShadow }) =>
                    $boxShadow &&
                    css`
                        border-bottom-width: 1px;
                    `}
            }
        }

        .ant-tabs-tab {
            font-weight: 400;
            position: relative;

            a {
                color: inherit;
            }
        }

        .ant-tabs-card {
            .ant-tabs-tab {
                background-color: ${({ theme }) => theme.neutralPalette.gray_1};
                position: relative;

                &:before {
                    position: absolute;
                    content: '';
                    display: block;
                    left: -3px;
                    width: 2px;
                    bottom: -1px;
                    height: 1px;
                    background-color: ${({ theme }) => theme.neutralPalette.gray_4};
                }

                &:first-child:before {
                    display: none;
                }
            }

            .ant-tabs-tab-active {
                background-color: ${({ theme }) => theme.neutralPalette.gray_2};
                border-bottom-color: ${({ theme }) => theme.neutralPalette.gray_2} !important;
            }
        }
    `,
};
