import { ColumnFilterValue, DateColumnFilterValue } from 'src/components/SearchBar/types';

export type EncounterListFilters = ColumnFilterValue[] &
    [
        {
            id: 'patient';
            type: 'string';
            placeholder: string;
        },
        {
            id: 'practitioner';
            type: 'string';
            placeholder: string;
        },
        {
            id: 'date';
            type: 'date';
            placeholder: [string, string];
        },
    ];

export type EncounterListFilterValues = ColumnFilterValue[] &
    [
        {
            column: EncounterListFilters[0];
            value?: string;
        },
        {
            column: EncounterListFilters[1];
            value?: string;
        },
        {
            column: EncounterListFilters[2];
            value?: DateColumnFilterValue;
        },
    ];
