import styled from 'styled-components/macro';

export const S = {
    Content: styled.div`
        width: 710px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: 24px 32px;
        border-radius: 10px;
    `,
};
