import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

export interface InvoiceOverviewProps {
    invoice: Invoice;
    patient: Patient;
    practitioner: Practitioner;
    practitionerRole: PractitionerRole;
}
