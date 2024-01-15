import { Invoice, Practitioner, PractitionerRole, Patient, ChargeItem } from 'fhir/r4b';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';
import { getFHIRReferenceResourceId } from 'src/utils/reference';

import { InvoiceDetailsLineItemsProps } from './types';

export function useInvoiceDetails(invoiceId?: string) {
    const [response] = useService(async () => {
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
                    invoice: resources.Invoice[0],
                    patient: resources.Patient[0],
                    practitionerRole: resources.PractitionerRole[0],
                    practitioner: resources.Practitioner[0],
                };
            },
        );
    });

    return {
        invoiceDetailsResponse: response,
    };
}

export function useInvoiceLineItems(props: InvoiceDetailsLineItemsProps) {
    const chargeItemIds = props.invoice?.lineItem
        ?.map((lineItem) => getFHIRReferenceResourceId(lineItem.chargeItemReference))
        .join(',');
    return useService(async () => {
        return mapSuccess(
            await getFHIRResources<ChargeItem>('ChargeItem', {
                _id: chargeItemIds,
            }),
            (bundle) => {
                const chargeItems = extractBundleResources(bundle).ChargeItem;

                return chargeItems.map((chargeItem) => {
                    return {
                        id: chargeItem.id,
                        serviceName: chargeItem.code?.coding?.[0]?.display,
                    };
                });
            },
        );
    });
}
