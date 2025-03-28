import styled from 'styled-components';

import { Text } from 'src/components/Typography';

export const S = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        gap: 10px 0;
        color: ${({ theme }) => theme.neutral.primaryText};
    `,
    Card: styled.div`
        display: flex;
        gap: 0 24px;
        padding: 16px;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        border-radius: 6px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
    `,
    Columns: styled.div`
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px 0;
    `,
    RowSelection: styled.div``,
    Column: styled.div`
        display: flex;
        flex-direction: column;
        gap: 4px 0;
    `,
    Title: styled(Text)`
        font-weight: 700;
    `,
    Content: styled.div``,
    Pagination: styled.div`
        display: flex;
        justify-content: flex-end;
    `,
};
