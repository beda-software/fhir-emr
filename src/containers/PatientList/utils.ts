import { t } from '@lingui/macro';

import { SearchParams, formatFHIRDate } from '@beda.software/fhir-react';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';

export function makePatientListFilters(nameSearchParam: string, hmbSearchParam: string): SearchBarColumn[] {
    return [
        {
            id: 'name',
            searchParam: nameSearchParam,
            type: SearchBarColumnType.SPLITSTRING,
            placeholder: t`Find patient`,
            placement: ['search-bar', 'table'],
            searchBehavior: 'AND',
            separator: ' ',
        },
        {
            id: 'hmb-assessment',
            searchParam: hmbSearchParam,
            type: SearchBarColumnType.CHOICE,
            placeholder: t`Passed assessment`,
            options: [
                {
                    value: {
                        Coding: {
                            code: 'heavy-menstrual-bleeding-screening',
                            display: t`HMB assessment`,
                        },
                    },
                },
            ],
        },
    ];
}

export function getPatientSearchParamsForPractitioner(practitionerId: string): SearchParams {
    return {
        status: 'active',
        category: 'data-sharing',
        period: formatFHIRDate(new Date()),
        actor: practitionerId,
        _include: ['Consent:patient:Patient'],
    };
}
