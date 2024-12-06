import { ItemType } from 'antd/lib/menu/hooks/useItems';

export interface MenuItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    children?: ItemType[];
}
