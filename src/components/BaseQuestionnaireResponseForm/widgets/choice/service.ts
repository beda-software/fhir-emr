import { service } from 'aidbox-react/lib/services/service';

import { ValueSet, ValueSetExpansionContains } from '@beda.software/aidbox-types';
import { isSuccess, mapSuccess, RemoteDataResult } from '@beda.software/remote-data';

export type ValueSetOption = {
    value: { Coding: ValueSetExpansionContains };
};

export async function expandValueSet(answerValueSet: string | undefined, searchText: string) {
    if (!answerValueSet) {
        return [];
    }

    const valueSetId = answerValueSet.split('/').slice(-1);

    const response: RemoteDataResult<ValueSetOption[]> = mapSuccess(
        await service<ValueSet>({
            url: `ValueSet/${valueSetId}/$expand`,
            params: {
                filter: searchText,
                count: 50,
            },
        }),
        (expandedValueSet) => {
            const expansionEntries = Array.isArray(expandedValueSet.expansion?.contains)
                ? expandedValueSet.expansion!.contains
                : [];

            return expansionEntries.map((entry) => ({
                value: { Coding: entry },
            }));
        },
    );

    if (isSuccess(response)) {
        return response.data;
    }

    return [];
}
