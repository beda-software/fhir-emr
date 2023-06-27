import { useState } from 'react';

import { S } from './Sidebar.styles';
import { SidebarBottom } from './SidebarBottom';
import { SidebarTop } from './SidebarTop';

export function AppSidebar() {
    const [collapsed, setCollapsed] = useState(true);

    const collapsedWidth = 80;
    const width = 248;

    return (
        <S.Container style={{ width: collapsed ? collapsedWidth : width }}>
            <S.Sidebar collapsible collapsed={collapsed} collapsedWidth={collapsedWidth} width={width} trigger={null}>
                <S.SidebarContent>
                    <SidebarTop collapsed={collapsed} />
                    <SidebarBottom collapsed={collapsed} toggleCollapsed={() => setCollapsed((v) => !v)} />
                </S.SidebarContent>
            </S.Sidebar>
        </S.Container>
    );
}
