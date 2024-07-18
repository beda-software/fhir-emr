import { Typography } from 'antd';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;

export const S = {
    HeaderSpace: styled.div`
        @media print {
            height: 40px;
        }
        height: 0;
    `,
    FooterSpace: styled.div`
        @media print {
            height: 40px;
        }
        height: 0;
    `,
    Container: styled.div`
        @page {
            margin: 15mm 15mm 15mm 25mm;
        }
        width: 100%;
        max-width: 767px;
        margin: 40px auto;
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
