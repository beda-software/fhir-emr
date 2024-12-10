import styled from 'styled-components';

import { Paragraph } from 'src/components/Typography';

export const S = {
    Question: styled(Paragraph)`
        padding: 9px 0;
        border-bottom: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        gap: 4px 16px;
        margin: 0;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 0 !important;

        &:first-of-type {
            border-top: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        }
    `,
    Audio: styled.audio`
        height: 52px;
        width: 100%;
    `,
};
