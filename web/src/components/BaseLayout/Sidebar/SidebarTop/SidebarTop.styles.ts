import styled from 'styled-components/macro';

export const S = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        padding: 0 4px;
        gap: 4px;

        .ant-menu {
            background: 0 !important;
        }

        .ant-menu-item {
            height: 48px !important;
            line-height: 24px !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            color: ${({ theme }) => `${theme.neutral.primaryText} !important`};
            border-radius: 6px !important;
            transition: height 0.2s;
        }

        .ant-menu-item:hover:not(.ant-menu-item-selected) {
            background: 0 !important;
            color: ${({ theme }) => `${theme.primary} !important`};
        }

        .ant-menu-item.ant-menu-item-selected {
            background-color: #f5f5f5 !important;
            color: #0a0e2c !important;
        }
    `,
};
