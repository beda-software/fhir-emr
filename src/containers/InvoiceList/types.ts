import { Invoice } from 'fhir/r4b';

export interface ModalCancelInvoiceProps {
    onSuccess: () => void;
    invoice: Invoice;
}
