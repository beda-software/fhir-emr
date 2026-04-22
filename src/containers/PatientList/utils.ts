import { t } from '@lingui/macro';

import { SearchParams, formatFHIRDate } from '@beda.software/fhir-react';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';

const HMB_SCREENING_QUESTIONNAIRE_ID = 'heavy-menstrual-bleeding-screening';

function makeHmbAssessmentFilter(searchParam: string): SearchBarColumn {
    return {
        id: 'hmb-assessment',
        searchParam,
        type: SearchBarColumnType.CHOICE,
        placeholder: t`HMB assessment`,
        options: [
            {
                value: {
                    Coding: {
                        code: HMB_SCREENING_QUESTIONNAIRE_ID,
                        display: t`Existing HMB assessment`,
                    },
                },
            },
        ],
    };
}

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
        makeHmbAssessmentFilter(hmbSearchParam),
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
