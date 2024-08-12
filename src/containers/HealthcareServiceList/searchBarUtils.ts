import { t } from '@lingui/macro';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';

export function getHealthcareServiceListSearchBarColumns(): SearchBarColumn[] {
    return [
        {
            id: 'service',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by name`,
        },
    ];
}
