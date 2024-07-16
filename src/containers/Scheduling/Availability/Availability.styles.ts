import { Divider } from 'antd';
import styled from 'styled-components';

export const S = {
    Content: styled.div`
        width: 440px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: 32px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 32px;
    `,
    Divider: styled(Divider)`
        margin: 0;
    `,
};
