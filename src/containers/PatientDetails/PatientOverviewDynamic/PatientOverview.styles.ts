import { Button } from 'antd';
import styled from 'styled-components';

export const S = {
    DetailsTitle: styled.div`
        color: ${({ theme }) => theme.neutralPalette.gray_7};
    `,
    Container: styled.div`
        display: flex;
        flex-direction: column;
        gap: 24px;
    `,
    DetailsRow: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 16px;
        flex-wrap: wrap;
        gap: 16px;
        @media screen and (max-width: 680px) {
            flex-direction: column;
            align-items: flex-start;
        }
    `,
    DetailItem: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        font-weight: 500;
    `,
    EditButton: styled(Button)`
        padding: 0;
        font-weight: 700;
    `,
    Cards: styled.div`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
        @media screen and (max-width: 1280px) {
            flex-wrap: wrap;
        }
    `,
    Column: styled.div`
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 100%;
        @media screen and (min-width: 1281px) {
            flex: 1;
        }
    `,
};
