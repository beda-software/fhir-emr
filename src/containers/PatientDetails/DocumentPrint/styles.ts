import { Typography } from 'antd';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;

export const S = {
    HeaderSpace: styled.div`
        height: 0;
        @media print {
            height: 40px;
        }
    `,
    FooterSpace: styled.div`
        height: 0;
        @media print {
            height: 40px;
        }
    `,
    Container: styled.div`
        width: 100%;
        max-width: 767px;
        margin: 40px auto;
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
