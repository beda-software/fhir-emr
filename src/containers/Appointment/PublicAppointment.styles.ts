import { Layout } from 'antd';
import styled from 'styled-components/macro';

export const S = {
    Container: styled(Layout)`
        min-height: 100vh;
    `,
    Content: styled.div`
        width: 540px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: 32px;
        border-radius: 10px;
    `,
};
