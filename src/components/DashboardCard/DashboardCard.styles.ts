import styled from 'styled-components';

export const S = {
    Wrapper: styled.div`
        overflow-x: auto;
    `,
    Card: styled.div`
        border-radius: 10px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        color: ${({ theme }) => theme.neutralPalette.gray_13};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        min-width: fit-content;

        &._empty {
            color: ${({ theme }) => theme.neutralPalette.gray_6};
        }
    `,
    Header: styled.div`
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        & > * {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `,
    Title: styled.div`
        font-size: 16px;
        line-height: 24px;
        font-weight: bold;
    `,
    Icon: styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${({ theme }) => theme.primary};
        width: 48px;
        height: 48px;
        min-width: 48px;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;

        &._empty {
            background-color: ${({ theme }) => theme.primaryPalette.bcp_2};
        }
    `,
    Content: styled.div`
        border-top: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        font-size: 14px;
        line-height: 22px;
    `,
    Table: styled.table`
        width: 100%;
    `,
    TableHeader: styled.tr`
        font-weight: 700;
    `,
    TableRow: styled.tr`
        border-top: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};

        &:first-child {
            border-left: 0;
        }
    `,
    TableCell: styled.td`
        padding: 13px 12px;
        border-left: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};

        &:first-child {
            border-left: 0;
        }
    `,
};
