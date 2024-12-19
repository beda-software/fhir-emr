import { Tabs as ANTDTabs, TabsProps as ANTDTabsProps } from 'antd';

import { S } from './styles';

export interface TabsProps extends ANTDTabsProps {
    boxShadow?: boolean;
}

export function Tabs(props: TabsProps) {
    const { boxShadow = true, ...rest } = props;

    return (
        <S.Tabs $boxShadow={boxShadow}>
            <ANTDTabs size="large" {...rest} />
        </S.Tabs>
    );
}
