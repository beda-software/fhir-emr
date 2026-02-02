import { Flex } from 'antd';
import { Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { TitleDetailsItem, TitleDetailsItemProps } from 'src/uberComponents/TitleDetails/TitleDetailsItem';

export interface TitleDetailsProps<R extends Resource> {
    items: Array<TitleDetailsItemProps<R>>;
    context: RecordType<WithId<R>>;
}

export function TitleDetails<R extends Resource>(props: TitleDetailsProps<R>) {
    const { items, context } = props;

    return (
        <Flex gap={16} align="center">
            {items.map((item) => (
                <TitleDetailsItem key={item.key} icon={item.icon} getValue={item.getValue} context={context} />
            ))}
        </Flex>
    );
}
