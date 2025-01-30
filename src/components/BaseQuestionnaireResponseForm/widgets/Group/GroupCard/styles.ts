import { Card } from 'antd';
import styled, { css } from 'styled-components';

export const S = {
    Card: styled(Card)<{ $variant: 'main-card' | 'sub-card' }>`
        .ant-card-head {
            background-color: ${({ theme }) => theme.neutralPalette.gray_3};
        }

        ${({ $variant }) =>
            $variant === 'sub-card' &&
            css`
                .ant-card-head {
                    background-color: ${({ theme }) => theme.neutralPalette.gray_2};
                }
            `}
    `,
    GroupContent: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    `,
};
