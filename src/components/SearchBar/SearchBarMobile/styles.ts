import { Badge, Button, Drawer } from 'antd';
import styled from 'styled-components';

export const S = {
    Container: styled.div``,
    FiltersButton: styled.div`
        position: relative;
    `,
    Badge: styled(Badge)`
        position: absolute;
        right: -3px;
        top: -3px;

        .ant-badge-count {
            background-color: ${({ theme }) => theme.primaryPalette.bcp_2};
            color: ${({ theme }) => theme.primary};
        }
    `,
    CloseIcon: styled(Button)`
        height: 56px;
        width: 48px !important;
        color: ${({ theme }) => theme.neutralPalette.gray_7} !important;

        &:hover {
            background: 0 !important;
        }
    `,
    Drawer: styled(Drawer)`
        padding-top: 56px;
        padding-bottom: 129px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};

        .ant-drawer-body {
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .ant-input-search,
        .ant-picker,
        .react-select__control {
            width: 100%;
            max-width: 450px;
        }
    `,
    DrawerHeader: styled.div`
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 56px;
        padding-left: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
    `,
    DrawerContent: styled.div`
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        flex: 1;
    `,
    DrawerFooter: styled.div`
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        border-top: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
    `,
};
