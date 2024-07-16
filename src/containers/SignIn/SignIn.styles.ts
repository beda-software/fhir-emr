import styled from 'styled-components';

import { Text } from 'src/components/Typography';

export const S = {
    Container: styled.div`
        min-height: 100vh;
        position: relative;
        padding: 0 16px 64px;
        background-color: ${({ theme }) => theme.primary};
        flex-direction: column;
        align-items: center;
        padding-top: 20vh;
        display: flex;
    `,
    Form: styled.div`
        display: flex;
        flex-direction: column;
        max-width: 390px;
        width: 100%;
        padding: 16px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
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
    CredentialsWrapper: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,
    CredentialsBlock: styled.div`
        display: flex;
        flex-direction: column;
    `,
    CredentialsList: styled.div`
        display: flex;
        flex-direction: row;
        gap: 4px;
    `,
    CredentialLabel: styled.span`
        font-weight: bold;
    `,
    CredentialName: styled.span`
        text-decoration: underline dotted;
    `,
    ButtonsWrapper: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
};
