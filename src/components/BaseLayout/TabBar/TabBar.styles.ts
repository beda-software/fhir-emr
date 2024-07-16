import { Button, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const S = {
    TabBar: styled.div`
        position: fixed;
        height: 50px;
        left: 0;
        right: 0;
        top: 0;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        z-index: 11;
        border-bottom: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        display: flex;
        justify-content: space-between;

        @media screen and (min-width: 768px) {
            display: none;
        }
    `,
    LogoWrapper: styled(Link)`
        height: 50px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 24px;
        transition: padding 0.2s;
    `,
    CloseIcon: styled(Button)`
        position: absolute;
        right: 0;
        top: 0;
        height: 68px;
        width: 68px !important;
        color: ${({ theme }) => theme.neutralPalette.gray_7} !important;

        &:hover {
            background: 0 !important;
        }

        svg {
            width: 18px;
            height: 18px;
        }
    `,
    Button: styled(Button)`
        height: 50px;
        width: 75px !important;
        padding: 0 !important;

        &:hover {
            background: 0 !important;
        }

        svg {
            width: 18px;
            height: 18px;
        }
    `,
    Drawer: styled(Drawer)`
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};

        .ant-drawer-body {
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    `,
};
