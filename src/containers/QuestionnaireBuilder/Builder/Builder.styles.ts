import { Button } from 'antd';
import styled from 'styled-components';

export const S = {
    Container: styled.div`
        cursor: grab;
        position: relative;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_5};
        border-radius: 10px;
        padding: 16px;
        margin-right: 40px;
        transition: border-color 0.2s;

        &:hover {
            border-color: #fa8c16;
        }
    `,
    DropArea: styled.div`
        position: absolute;
        left: 0;
        right: 40px;
        height: 6px;
        background-color: #fa8c16;
        border-radius: 2px;
        transition: height 0.1s;
        opacity: 0;

        &._over {
            opacity: 1;
        }

        &._up {
            top: 6px;
        }

        &._down {
            bottom: -10px;
        }
    `,
    Button: styled(Button)`
        padding: 8px 12px;
        color: ${({ theme }) => theme.neutralPalette.gray_7};
        font-size: 16px;
        transition: color 0.2s;
        height: auto;
        border: 0;

        &:hover {
            color: ${({ theme }) => theme.neutralPalette.gray_10} !important;
            background: 0 !important;
        }
    `,
};
