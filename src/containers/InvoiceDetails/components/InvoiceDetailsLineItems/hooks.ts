import { ChargeItem } from 'fhir/r4b';

import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { InvoiceDetailsLineItemsProps } from './types';

export function useInvoiceLineItems(props: InvoiceDetailsLineItemsProps) {
    const chargeItemIds = props.invoice.lineItem
        ?.map((lineItem) => lineItem.chargeItemReference?.reference?.split('/')[1])
        .join(',');
    return useService(async () => {
        return mapSuccess(
            await getFHIRResources<ChargeItem>('ChargeItem', {
                _id: chargeItemIds,
            }),
            (bundle) => {
                const chargeItems = extractBundleResources(bundle).ChargeItem;

                return chargeItems.map((chargeItem, idx) => {
                    return {
                        id: chargeItem.id,
                        title: `Item #${idx + 1}`,
                        value: chargeItem.code?.coding?.[0]?.display,
                    };
                });
            },
        );
    });
}
