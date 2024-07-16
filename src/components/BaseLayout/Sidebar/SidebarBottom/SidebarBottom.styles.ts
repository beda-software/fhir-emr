import { Divider } from 'antd';
import styled from 'styled-components';

export const S = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        padding: 24px;
        gap: 8px;

        .ant-menu {
            background: 0;

            .anticon {
                display: flex !important;
                font-size: 16px !important;
                height: 32px !important;
                line-height: 32px !important;
            }
        }

        .ant-menu-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0 10px;
            background: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
        }

        .ant-menu-item:hover:not(.ant-menu-item-selected) {
            background: 0 !important;
            color: ${({ theme }) => theme.primary} !important;
        }

        .ant-menu-item.ant-menu-item-selected {
            background-color: ${({ theme }) => theme.neutralPalette.gray_3} !important;
            color: ${({ theme }) => theme.neutralPalette.gray_13} !important;
        }

        .ant-menu-title-content {
            margin: 0 !important;
        }

        .ant-menu-submenu-title {
            display: flex;
            align-items: center;
            height: 40px !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;

            &:hover:not(.ant-menu-item-selected) {
                background: 0 !important;
                color: ${({ theme }) => theme.primary} !important;
            }

            .ant-menu-item-selected {
                background: 0 !important;
            }
        }

        .ant-menu-submenu-arrow {
            inset-inline-end: 4px !important;
        }

        .ant-menu-sub {
            font-size: 12px;
        }

        .ant-menu-sub .ant-menu-item {
            height: 28px !important;
            margin: 4px 0 0 0 !important;
            padding: 0 0 0 42px !important;
            width: 100% !important;

            &:last-of-type {
                margin-bottom: 12px !important;
            }

            &:hover:not(.ant-menu-item-selected) {
                background: 0 !important;
                color: ${({ theme }) => theme.primary} !important;
            }

            .anticon {
                font-size: 14px !important;
            }
        }
    `,
    Icon: styled.div`
        background-color: ${({ theme }) =>
            theme.mode === 'dark' ? theme.neutralPalette.gray_3 : theme.neutralPalette.gray_2};
        min-width: 32px;
        height: 32px;
        width: 32px;
        min-width: 32px !important;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${({ theme }) => theme.neutralPalette.gray_7} !important;
        font-size: 16px;
    `,
    Divider: styled(Divider)<{ $hidden: boolean }>`
        margin: 0;
        transition: all 0s;
        opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
    `,
};
