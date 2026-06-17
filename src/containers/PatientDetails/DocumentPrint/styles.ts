import { Typography } from 'antd';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;

export const S = {
    PrintWrapper: styled.div`
        margin: 0 auto;
        padding: 0;
        @media print {
            margin: 0 auto;
        }

        @media screen {
            width: 210mm;
        }
    `,
    HeaderSpace: styled.div<{ $headerHeight?: string }>`
        height: 0;
        @media print {
            height: ${(props) => (props.$headerHeight ? props.$headerHeight : '10px')};
        }
    `,
    Container: styled.div`
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0 30px;
    `,
    Cover: styled.div`
        min-height: calc(var(--pagedjs-pagebox-height) - var(--pagedjs-margin-top) - var(--pagedjs-margin-bottom));
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
            max-width: 100%;
            object-fit: contain;
        }
    `,
    Header: styled.div`
        max-width: 100%;
        img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
    `,
    HeaderFirstPage: styled.div`
        img {
            width: 100%;
            height: auto;
            object-fit: contain;
        }
    `,
    FooterLastPage: styled.div`
        img {
            display: block;
            width: 100%;
            object-fit: contain;
        }
    `,
    FooterLastPageWrapper: styled.div`
        break-inside: avoid;
    `,
    Footer: styled.div`
        max-width: 100%;
        margin-top: auto;
        img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        @media print {
            display: none;
        }
    `,
    Title: styled(Text)`
        font-size: 16px;
        font-weight: 700;
        line-height: 16px;
        margin-bottom: 24px;
        display: block;
    `,
    P: styled(Paragraph)`
        font-size: 12px;
        line-height: 16px;
    `,
};
