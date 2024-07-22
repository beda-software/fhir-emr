import { Typography } from 'antd';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;

export const S = {
    HeaderSpace: styled.div<{ $headerHeight?: string }>`
        height: 0;
        @media print {
            height: ${(props) => (props.$headerHeight ? props.$headerHeight : '10px')};
        }
    `,
    FooterSpace: styled.div<{ $footerHeight?: string }>`
        height: 0;
        @media print {
            height: ${(props) => (props.$footerHeight ? props.$footerHeight : '10px')};
        }
    `,
    Container: styled.div<{ $pageMargin?: string }>`
        width: 100%;
        max-width: 767px;
        margin: ${(props) => (props.$pageMargin ? props.$pageMargin : '40px auto')};
        @page {
            margin: 15mm 15mm 15mm 25mm;
        }
        @media print {
            max-width: 100%;
            margin: 0 0 0 0;
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
