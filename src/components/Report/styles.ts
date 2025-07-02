import styled, { css } from 'styled-components';

import { Text } from '../Typography';

export const S = {
    Container: styled.div<{ $fullWidth?: boolean }>`
        display: flex;
        justify-content: flex-start;
        gap: 16px 40px;
        padding: 16px;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        border-radius: 10px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        width: fit-content;

        ${({ $fullWidth }) =>
            $fullWidth &&
            css`
                width: auto;
                justify-content: space-between;
            `}
    `,
    Item: styled.div`
        display: flex;
        flex-direction: column;
        gap: 4px 0;
    `,
    Label: styled(Text)`
        font-size: 12px;
        line-height: 20px;
        color: ${({ theme }) => theme.neutralPalette.gray_7};
    `,
    Value: styled(Text)`
        font-weight: 700;
    `,
};
