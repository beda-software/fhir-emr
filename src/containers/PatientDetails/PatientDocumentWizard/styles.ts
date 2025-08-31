import styled from 'styled-components';

export const S = {
    Content: styled.div`
        width: 100%;
        margin: 0 auto;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: 32px;
        border-radius: 10px;
    `,
};
