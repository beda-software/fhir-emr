import { Layout } from 'antd';
import styled from 'styled-components/macro';

const { Sider } = Layout;

export const S = {
    Container: styled.div`
        transition: all 0.2s;
    `,
    Sidebar: styled(Sider)`
        position: fixed !important;
        overflow: auto;
        top: 0;
        left: 0;
        bottom: 0;
        box-shadow: inset -1px 0px 0px ${({ theme }) => theme.neutralPalette.gray_4};
        z-index: 1;
    `,
    SidebarContent: styled.div`
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `,
};
