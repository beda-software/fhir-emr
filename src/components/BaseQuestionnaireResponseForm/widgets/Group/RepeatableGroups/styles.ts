import styled from 'styled-components';

export const S = {
    Group: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px 24px;
        width: 100%;
    `,
    Footer: styled.div`
        display: flex;
        flex-direction: column;
        padding-top: 8px;

        &:first-child {
            padding-top: 0;
        }
    `,
    Card: styled.div`
        border: 1px solid ${({ theme }) => theme.neutral.dividers};
        border-radius: 6px;
    `,
    CardHeader: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid ${({ theme }) => theme.neutral.dividers};
        background-color: ${({ theme }) => theme.neutralPalette.gray_2};
    `,
    CardContent: styled.div`
        display: flex;
        flex-direction: column;
        padding: 24px;
        gap: 16px;
    `,

    Row: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 16px 24px;
    `,
    RowItems: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 16px;
        width: 100%;
    `,
    RowControls: styled.div`
        padding-top: 34px;
    `,
};
