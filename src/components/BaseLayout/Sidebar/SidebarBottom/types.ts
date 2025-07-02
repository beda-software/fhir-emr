import { ItemType } from 'antd/lib/menu/interface';

export interface MenuItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    children?: ItemType[];
}
