import { Encounter, Patient, Questionnaire } from 'shared/src/contrib/aidbox';

import { EncounterData } from 'src/containers/EncounterList/types';
import { PractitionerListRowData } from 'src/containers/PractitionerList/hooks';

export type SearchBarItem =
    | Patient
    | Encounter
    | Questionnaire
    | EncounterData
    | PractitionerListRowData;

export interface PopulatedSearchData<T> {
    searchProp: string | moment.Moment;
    item: T;
}

export interface SearchBarProps<T> {
    columns: SearchBarColumn<T>[];
    data: T[];
}
export type PopulateSearchProp<T> = (item: T) => string;
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

export type DateColumnFilterValue = [moment.Moment, moment.Moment];
export interface ColumnFilterValue<T> {
    column: SearchBarColumn<T>;
    value?: DateColumnFilterValue | string;
}

export interface SearchBarData<T> {
    columnsFilterValues: ColumnFilterValue<T>[];
    filteredData: T[];
    onChangeColumnFilter: (value: DateColumnFilterValue | string, key: string) => void;
    onResetFilters: () => void;
}
