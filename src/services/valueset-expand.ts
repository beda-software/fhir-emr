import axios from 'axios';
import { ValueSet, ValueSetExpansionContains } from 'fhir/r4b';
import { upperFirst } from 'lodash';

import { service } from 'aidbox-react/lib/services/service';

import { SearchParams } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, success, failure, RemoteDataResult, RemoteData } from '@beda.software/remote-data';

import { getCurrentLocale } from './i18n';

export type ValueSetOption = {
    value: { Coding: ValueSetExpansionContains };
};

const instanceHealthSamurai = axios.create({
    baseURL: 'https://tx.health-samurai.io',
    headers: {
        Accept: 'application/json;charset=UTF=8',
    },
});

export async function expandHealthSamuraiValueSet(
    answerValueSet: string,
    searchText: string,
    extra?: SearchParams,
): Promise<RemoteData> {
    try {
        const response = await instanceHealthSamurai.get('/fhir/ValueSet/$expand', {
            params: {
                url: answerValueSet,
                _format: 'json',
                filter: searchText,
                count: 50,
                displayLanguage: getCurrentLocale(),
                ...extra,
            },
        });
        return success(
            response.data.expansion.contains.map((item: { code: string; system: string; display: string }) => ({
                value: {
                    Coding: {
                        code: item.code,
                        system: item.system,
                        display: upperFirst(item.display),
                    },
                },
            })),
        );
    } catch (error) {
        return failure(error);
    }
}

export async function expandFHIRValueSet(answerValueSet: string | undefined, searchText: string) {
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

            return expansionEntries.map(({ code, system, display }) => {
                return {
                    value: { Coding: { code, system, display } },
                };
            });
        },
    );

    if (isSuccess(response)) {
        return response.data;
    }

    return [];
}

interface ExpandValueSetProps {
    answerValueSet: string | undefined;
    searchText: string;
    predefinedValueSetsList?: string[];
}

/*
    Example of usage with predefined value sets.
    For ValueSet http://hl7.org/fhir/ValueSet/relatedperson-relationshiptype
    expandValueSet({ predefinedValueSetsList: ['relatedperson-relationshiptype'], answerValueSet, searchText })
*/

export async function expandValueSet(props: ExpandValueSetProps) {
    const { answerValueSet, searchText, predefinedValueSetsList = [] } = props;

    if (!answerValueSet) {
        return [];
    }

    const valueSetName = answerValueSet.split('/').at(-1) as string;

    if (predefinedValueSetsList.includes(valueSetName)) {
        const response = await expandHealthSamuraiValueSet(answerValueSet, searchText);

        if (isSuccess(response)) {
            return response.data;
        } else {
            return [];
        }
    }

    const response = await expandFHIRValueSet(answerValueSet, searchText);

    return response;
}

export async function expandEMRValueSet(answerValueSet: string | undefined, searchText: string) {
    const predefinedValueSetsList: string[] = ['medicationknowledge-package-type'];

    return expandValueSet({
        answerValueSet,
        searchText,
        predefinedValueSetsList,
    });
}
