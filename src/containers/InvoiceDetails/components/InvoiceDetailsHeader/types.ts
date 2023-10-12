import { Invoice, Patient, Practitioner } from 'fhir/r4b';

export interface InvoiceDetailsHeaderProps {
    invoice?: Invoice;
    patient?: Patient;
    practitioner?: Practitioner;
}
