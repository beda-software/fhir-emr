import { Divider } from 'antd';
import styled from 'styled-components/macro';

export const S = {
    Content: styled.div`
        width: 440px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        box-shadow: 0px 6px 16px ${({ theme }) => theme.neutralPalette.gray_4};
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
