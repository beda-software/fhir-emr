import { Flex } from 'antd';
import { ReactElement } from 'react';

import { TitleDetailsItem } from 'src/uberComponents/TitleDetails/TitleDetailsItem';

export interface TitleDetailsItem {
    key: string;
    icon?: ReactElement;
    value?: string | ReactElement | undefined;
}

export interface TitleDetailsProps {
    items: Array<TitleDetailsItem>;
}

export function TitleDetails(props: TitleDetailsProps) {
    const { items } = props;

    return (
        <Flex gap={16} align="center">
            {items.map(({ key, icon, value }) => (
                <TitleDetailsItem key={key} icon={icon} value={value} />
            ))}
        </Flex>
    );
}
