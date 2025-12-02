import type { ItemType } from 'antd/es/menu/interface';

export interface MenuItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    children?: ItemType[];
}
