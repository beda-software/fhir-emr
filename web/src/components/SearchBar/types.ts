import { Encounter, Patient, Questionnaire } from 'shared/src/contrib/aidbox';

import { EncounterData } from 'src/containers/EncounterList/types';
import { PractitionerListRowData } from 'src/containers/PractitionerList/hooks';

export type PopulateSearchProp<T> = (item: T) => string;

export interface PopulatedSearchData<T> {
    searchProp: string;
    item: T;
}

export type SearchBarColumn<T> =
    | {
          id: string;
          type: 'string';
          key: PopulateSearchProp<T> | string;
          placeholder: string;
      }
    | {
          id: string;
          type: 'date';
          key: PopulateSearchProp<T> | string;
          placeholder: [string, string];
      };

export type SearchBarItem =
    | Patient
    | Encounter
    | Questionnaire
    | EncounterData
    | PractitionerListRowData;

export interface SearchBarProps<T> {
    columns: SearchBarColumn<T>[];
    data: T[];
}

export interface ColumnFilterValue<T> {
    value: string;
    column: SearchBarColumn<T>;
}

export interface SearchBarData<T> {
    columnsFilterValues: ColumnFilterValue<T>[];
    filteredData: T[];
    onChangeColumnFilter: (value: string, key: string) => void;
    onResetFilters: () => void;
}
