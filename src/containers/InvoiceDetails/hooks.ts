import { Invoice, Practitioner, PractitionerRole, Patient } from 'fhir/r4b';

import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

export function useInvoiceDetails(invoiceId: string) {
    return useService(async () => {
        return mapSuccess(
            await getFHIRResources<Invoice | PractitionerRole | Patient | Practitioner>('Invoice', {
                _id: invoiceId,
                _include: [
                    'Invoice:subject:Patient',
                    'Invoice:participant:PractitionerRole',
                    'PractitionerRole:practitioner:Practitioner',
                ],
            }),
            (bundle) => {
                const resources = extractBundleResources(bundle);

                return {
                    invoice: resources.Invoice[0]!,
                    patient: resources.Patient[0]!,
                    practitionerRole: resources.PractitionerRole[0]!,
                    practitioner: resources.Practitioner[0]!,
                };
            },
        );
    });
}
