import styled, { css } from 'styled-components';

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
    Label: styled.div<{ $isDate?: boolean }>`
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        ${({ $isDate }) =>
            $isDate &&
            css`
                justify-content: flex-start;
            `}
    `,
    HelpText: styled.div`
        text-align: center;
    `,
    HelpTextIcon: styled.div`
        color: ${({ theme }) => theme.neutralPalette.gray_7};
        padding: 0 8px;
        text-align: center;
    `,
    Footer: styled.div`
        ${footerStyles}
    `,
};
