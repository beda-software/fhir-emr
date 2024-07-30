import { Invoice, Practitioner, PractitionerRole, Patient } from 'fhir/r4b';

import { renderHumanName } from 'src/utils/fhir';

export function getInvoicePractitioner(
    invoice: Invoice,
    practitioners: Practitioner[],
    practitionerRoles: PractitionerRole[],
): Practitioner | undefined {
    const invoicePractitionerRoleParticipant = invoice.participant?.find(
        (participant) => participant.actor.reference?.split('/')?.[0] === 'PractitionerRole',
    );
    const invoicePractitionerRole = practitionerRoles.find(
        (practitionerRole) =>
            practitionerRole.id === invoicePractitionerRoleParticipant?.actor?.reference?.split('/')?.[1],
    );
    return practitioners.find(
        (practitioner) => practitioner.id === invoicePractitionerRole?.practitioner?.reference?.split('/')?.[1],
    );
}

export function getInvoicePatient(invoice: Invoice, patients: Patient[]): Patient | undefined {
    const invoicePatientId = invoice.subject?.reference?.split('/')?.[1];
    return patients.find((patient) => patient.id === invoicePatientId);
}

export function getPractitionerName(practitioner?: Practitioner): string {
    return practitioner ? renderHumanName(practitioner.name?.[0]) : 'Does not exist';
}

export function getPatientName(patient?: Patient): string {
    return patient ? renderHumanName(patient?.name?.[0]) : 'Does not exist';
}

export function formatMoney(amount: number) {
    // TODO: Implement more general solution for render money
    return (
        '$' +
        amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );
}
