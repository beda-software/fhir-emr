import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { mapSuccess, extractBundleResources } from 'fhir-react';

import { usePagerExtended } from 'src/hooks/pager';

export function useInvoicesList() {
    // const debouncedFilterValues = useDebounce(filterValues, 300);

    // const healthcareServiceFilterValue = debouncedFilterValues[0];

    const queryParameters = {
        _sort: '-_lastUpdated',
        _include: [
            'Invoice:patient:Patient',
            'Invoice:participant:PractitionerRole',
            'PractitionerRole:practitioner:Practitioner',
        ],
        // _revinclude: ['Practitioner:practitioner:PractitionerRole'],
        // ...(healthcareServiceFilterValue ? { ilike: healthcareServiceFilterValue.value } : {}),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Invoice | Patient | Practitioner | PractitionerRole
        // StringTypeColumnFilterValue[]
    >('Invoice', queryParameters, {});

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
