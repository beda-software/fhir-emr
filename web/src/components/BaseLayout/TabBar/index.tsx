import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { MenuIcon } from 'src/icons/general/Menu';

import { SidebarBottom } from '../Sidebar/SidebarBottom';
import { SidebarTop } from '../Sidebar/SidebarTop';
import { S } from './TabBar.styles';

export function AppTabBar() {
    const [menuOpened, toggleMenuOpened] = useState(false);

    return (
        <>
            <S.TabBar>
                <S.Button icon={<MenuIcon />} type="text" onClick={() => toggleMenuOpened((v) => !v)} />
            </S.TabBar>
            <S.Drawer placement="right" onClose={() => toggleMenuOpened(false)} open={menuOpened} closable={false}>
                <S.CloseIcon type="text" icon={<CloseOutlined />} onClick={() => toggleMenuOpened(false)} />
                <SidebarTop collapsed={false} onItemClick={() => toggleMenuOpened(false)} />
                <SidebarBottom collapsed={false} onItemClick={() => toggleMenuOpened(false)} />
            </S.Drawer>
        </>
    );
}
