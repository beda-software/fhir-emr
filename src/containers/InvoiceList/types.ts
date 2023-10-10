import { Invoice } from 'fhir/r4b';

import { ColumnFilterValue, DateColumnFilterValue } from 'src/components/SearchBar/types';

import { SelectOption } from '../OrganizationScheduling/HealthcareServicePractitionerSelect/types';

export interface ModalCancelInvoiceProps {
    onSuccess: () => void;
    invoice: Invoice;
}

export type InvoiceListFilters = ColumnFilterValue[] &
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
        {
            id: 'status';
            type: 'string';
            placeholder: string;
        },
    ];

export type InvoiceListFilterValues = ColumnFilterValue[] &
    [
        {
            column: InvoiceListFilters[0];
            value?: string;
        },
        {
            column: InvoiceListFilters[1];
            value?: string;
        },
        {
            column: InvoiceListFilters[2];
            value?: DateColumnFilterValue;
        },
        {
            column: InvoiceListFilters[3];
            value?: string;
        },
    ];

export interface InvoiceListSearchBarSelectProps {
    selectedPatient: SelectOption;
    selectedPractitionerRole: SelectOption;
    selectedStatus: SelectOption;
    loadPatientOptions: (search: string) => void;
    loadPractitionerRoleOptions: (search: string) => void;
    loadStatusOptions: (search: string) => void;
    onChangePatient: (option: SelectOption) => void;
    onChangePractitionerRole: (option: SelectOption) => void;
    onChangeStatus: (option: SelectOption) => void;
    reset: () => void;
}
