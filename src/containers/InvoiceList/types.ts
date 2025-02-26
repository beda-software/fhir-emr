import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { PagerManager } from '@beda.software/fhir-react';

import { SelectOption } from '../OrganizationScheduling/HealthcareServicePractitionerSelect/types';

export interface ModalCancelInvoiceProps {
    onSuccess: () => void;
    invoice: Invoice;
}
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

export interface InvoiceActionsProps {
    manager: PagerManager<Invoice | Patient | Practitioner | PractitionerRole>;
    invoice: Invoice;
    simplified?: boolean;
}
