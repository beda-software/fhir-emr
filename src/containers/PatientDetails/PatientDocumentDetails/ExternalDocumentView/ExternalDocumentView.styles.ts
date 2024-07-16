import styled, { css } from 'styled-components';

import { Title, Paragraph } from 'src/components/Typography';

export const S = {
    Container: styled.div`
        display: flex;
        justify-content: center;
    `,
    Content: styled.div`
        width: 540px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: 32px;
        border-radius: 10px;
    `,
    Header: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        gap: 16px;
        flex-wrap: wrap;
    `,
    Title: styled(Title)`
        margin: 0 !important;
    `,
    Question: styled(Paragraph)<{ row?: boolean; group?: boolean }>`
        display: flex;
        flex-direction: column;
        padding: 9px 0;
        border-bottom: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        gap: 4px 16px;
        margin: 0;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 0 !important;

        ${(props) =>
            props.row &&
            css`
                flex-direction: row;
                justify-content: space-between;
            `}

        ${(props) =>
            props.group &&
            css`
                font-size: 15px;
                font-weight: bold;
            `}

        &:first-of-type {
            border-top: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        }
    `,
    RowAnswer: styled.div`
        min-width: 40%;
        max-width: 40%;
    `,
};
