import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { usePagerExtended } from 'src/hooks/pager';

export function useInvoicesList(practitionerId?: string, patientId?: string, status?: string) {
    const queryParameters = {
        _sort: ['-_lastUpdated', '_id'],
        status: status,
        subject: patientId,
        participant: practitionerId,
        _include: [
            'Invoice:patient:Patient',
            'Invoice:participant:PractitionerRole',
            'PractitionerRole:practitioner:Practitioner',
        ],
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Invoice | Patient | Practitioner | PractitionerRole
    >('Invoice', queryParameters);

    const invoiceResponse = mapSuccess(resourceResponse, (bundle) => {
        return {
            invoices: extractBundleResources(bundle).Invoice,
            patients: extractBundleResources(bundle).Patient,
            practitionerRoles: extractBundleResources(bundle).PractitionerRole,
            practitioners: extractBundleResources(bundle).Practitioner,
        };
    });

    return {
        pagination,
        invoiceResponse,
        pagerManager,
        handleTableChange,
    };
}
