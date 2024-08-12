import { t } from '@lingui/macro';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';

export function getPatientListSearchBarColumns(): SearchBarColumn[] {
    return [
        {
            id: 'patient',
            type: SearchBarColumnType.STRING,
            placeholder: t`Find patient`,
        },
    ];
}
