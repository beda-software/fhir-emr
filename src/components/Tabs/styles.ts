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
    `,
};
