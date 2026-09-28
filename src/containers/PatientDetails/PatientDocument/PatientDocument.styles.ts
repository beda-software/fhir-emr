import styled from 'styled-components';

export const PATIENT_DOCUMENT_PADDING = 32;

export const S = {
    Content: styled.div<{ $maxWidth?: number | string }>`
        width: ${(props) => (props.$maxWidth ? props.$maxWidth : '760px')};
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: ${PATIENT_DOCUMENT_PADDING}px;
        border-radius: 10px;
    `,
};
