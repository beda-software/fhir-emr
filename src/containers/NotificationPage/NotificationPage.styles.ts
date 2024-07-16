import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Text } from 'src/components/Typography';

export const S = {
    Container: styled.div`
        min-height: 100vh;
        padding: 0 16px 64px;
        background-color: ${({ theme }) => theme.primary};
        flex-direction: column;
        align-items: center;
        padding-top: 20vh;
        display: flex;
    `,
    Title: styled(Text)`
        margin-top: -4px;
        font-family: Manrope;
        font-size: 38px;
        font-weight: 700;
        line-height: 46px;
        letter-spacing: 0em;
        text-align: center;
        color: var(--neutral-1, #fff);
    `,
    TextContainer: styled.div`
        padding: 16px 25px;
        background-color: #e6f7ff;
        width: 360px;
        border-radius: 8px;
        margin-top: 38px;
    `,
    Text: styled.div`
        color: var(--neutral-13, #000);
        text-align: center;
        font-family: Manrope;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
    `,
    Link: styled(Link)`
        height: 68px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 55px;
        margin-left: -6px;
        margin-top: 5px;
    `,
};
