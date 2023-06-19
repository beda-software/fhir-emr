import { Layout } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';

import s from './Sidebar.module.scss';
import { SidebarBottom } from './SidebarBottom';
import { SidebarTop } from './SidebarTop';

const { Sider } = Layout;

export function AppSidebar() {
    const [collapsed, setCollapsed] = useState(true);

    const collapsedWidth = 80;
    const width = 248;

    return (
        <div
            className={classNames(s.container, {
                _collapsed: collapsed,
            })}
            style={{ width: collapsed ? collapsedWidth : width }}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                className={s.sidebar}
                collapsedWidth={collapsedWidth}
                width={width}
                trigger={null}
            >
                <div className={s.sidebarContent}>
                    <SidebarTop collapsed={collapsed} />
                    <SidebarBottom collapsed={collapsed} toggleCollapsed={() => setCollapsed((v) => !v)} />
                </div>
            </Sider>
        </div>
    );
}
