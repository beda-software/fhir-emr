import { GroupItemProps } from 'sdc-qrf';

export interface RepeatableGroupProps {
    index: number;
    items: any;
    onChange: (event: any) => void;
    groupItem: GroupItemProps;
}
