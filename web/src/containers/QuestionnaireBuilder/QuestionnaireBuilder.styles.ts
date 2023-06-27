import { Button } from 'antd';
import styled from 'styled-components/macro';

export const S = {
    Content: styled.div`
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        box-shadow: 0px 6px 16px ${({ theme }) => theme.neutralPalette.gray_4};
        padding: 32px;
        border-radius: 10px;
        display: flex;
    `,
    LeftColumn: styled.div`
        width: 420px;
        border-left: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        margin-left: 30px;
        padding-left: 30px;
    `,
    CloseButton: styled(Button)`
        position: absolute;
        right: 0;
        padding: 8px 12px;
        margin-top: -8px;
        color: ${({ theme }) => theme.neutralPalette.gray_7};
        font-size: 16px;
        transition: color 0.2s;
        height: auto;
        border: 0;

        &:hover {
            color: ${({ theme }) => theme.neutralPalette.gray_8};
            background: 0 !important;
        }
    `,
};
