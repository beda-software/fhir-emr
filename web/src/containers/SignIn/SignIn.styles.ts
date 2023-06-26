import styled from 'styled-components/macro';

import { Text } from 'src/components/Typography';

export const S = {
    Container: styled.div`
        min-height: 100vh;
        position: relative;
        padding: 0 16px 64px;
        background-color: ${({ theme }) => theme.primary};
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 25vh;
    `,
    Form: styled.div`
        display: flex;
        flex-direction: column;
        max-width: 382px;
        width: 100%;
        padding: 18px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        gap: 32px;
        border-radius: 16px;
    `,
    Text: styled(Text)`
        margin: 0;
        font-weight: 700;
        font-size: 19px;
        line-height: 26px;
    `,
    Message: styled.div`
        background-color: ${({ theme }) => theme.neutralPalette.gray_2};
        color: ${({ theme }) => theme.neutralPalette.gray_13};
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
        font-size: 14px;
        line-height: 22px;
    `,
};
