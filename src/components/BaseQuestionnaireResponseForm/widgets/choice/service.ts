import { ValueSet } from 'fhir/r4b';

import { service } from 'aidbox-react/lib/services/service';

import { isSuccess, mapSuccess } from '@beda.software/remote-data';

export async function expandValueSet(answerValueSet: string, searchText: string) {
    const valueSetId = answerValueSet.split('/').slice(-1);

    const response = mapSuccess(
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

            return expansionEntries.map(({ code, system, display }) => ({
                value: { Coding: { code, system, display } },
            }));
        },
    );

    if (isSuccess(response)) {
        return response.data;
    }
    return [];
}
