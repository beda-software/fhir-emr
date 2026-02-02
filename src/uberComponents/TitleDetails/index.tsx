import { Flex } from 'antd';
import { Resource } from 'fhir/r4b';
import { ReactElement } from 'react';

import { WithId } from '@beda.software/fhir-react';

import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { TitleDetailsItem } from 'src/uberComponents/TitleDetails/TitleDetailsItem';

export interface TitleDetailsItem<R extends Resource> {
    key: string;
    icon?: ReactElement;
    getValue?: (record: RecordType<WithId<R>>) => string | ReactElement | undefined;
}

export interface TitleDetailsProps<R extends Resource> {
    items: Array<TitleDetailsItem<R>>;
    context: RecordType<WithId<R>>;
}

export function TitleDetails<R extends Resource>(props: TitleDetailsProps<R>) {
    const { items, context } = props;

    return (
        <Flex gap={16} align="center">
            {items.map((item) => (
                <TitleDetailsItem
                    key={item.key}
                    icon={item.icon}
                    value={item.getValue ? item.getValue(context) : undefined}
                />
            ))}
        </Flex>
    );
}
