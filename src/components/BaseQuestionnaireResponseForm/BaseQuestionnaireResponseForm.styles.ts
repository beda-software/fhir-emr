// eslint-disable-next-line import/named
import styled, { css } from 'styled-components/macro';

export const footerStyles = css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
    padding: 10px 0;

    .ant-modal & {
        padding: 10px 16px;
        border-top: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        margin: 30px -24px -30px;
    }
`;

export const S = {
    Footer: styled.div`
        ${footerStyles}
    `,
};
