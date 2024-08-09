import { t } from '@lingui/macro';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';

export function getQuestionnaireListSearchBarColumns(): SearchBarColumn[] {
    return [
        {
            id: 'questionnaire',
            type: SearchBarColumnType.STRING,
            placeholder: t`Find questionnaire`,
        },
    ];
}
