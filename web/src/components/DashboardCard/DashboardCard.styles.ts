import styled from 'styled-components/macro';

export const S = {
    Wrapper: styled.div`
        overflow-x: auto;
    `,
    Card: styled.div`
        border-radius: 10px;
        box-shadow: 0px 6px 16px ${({ theme }) => theme.neutralPalette.gray_4};
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        color: ${({ theme }) => theme.neutralPalette.gray_13};
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
        box-shadow: inset 0px 1px 0px ${({ theme }) => theme.neutralPalette.gray_4};
        font-size: 14px;
        line-height: 22px;
    `,
    TableHeader: styled.div`
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
    `,
    TableRow: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        box-shadow: inset 0px 1px 0px ${({ theme }) => theme.neutralPalette.gray_4};

        &:first-child {
            box-shadow: none;
        }
    `,
    TableCell: styled.div`
        display: flex;
        align-items: center;
        padding: 13px 12px;
        box-shadow: inset 1px 0px 0px ${({ theme }) => theme.neutralPalette.gray_4};

        &:first-child {
            box-shadow: none;
        }
    `,
};
