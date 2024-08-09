import { t } from '@lingui/macro';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';

export function getPractitionerListSearchBarColumns(): SearchBarColumn[] {
    return [
        {
            id: 'practitioner',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by name`,
        },
    ];
}
