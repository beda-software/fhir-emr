import { t } from '@lingui/macro';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';

export function getEncounterListSearchBarColumns(): SearchBarColumn[] {
    return [
        {
            id: 'patient',
            type: SearchBarColumnType.REFERENCE,
            placeholder: t`Search by patient`,
            expression: 'Patient',
            path: "name.given.first() + ' ' + name.family",
        },
        {
            id: 'practitioner',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by practitioner`,
        },
        {
            id: 'date',
            type: SearchBarColumnType.DATE,
            placeholder: [t`Start date`, t`End date`],
        },
    ];
}
