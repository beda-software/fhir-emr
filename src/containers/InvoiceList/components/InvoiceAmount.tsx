import { Invoice } from 'fhir/r4b';
import _ from 'lodash';

import { formatMoney } from '../utils';

export function InvoiceAmount({ invoice }: { invoice: Invoice }) {
    const priceComponents = _.flatten(invoice.lineItem?.map((lineItem) => lineItem.priceComponent));
    return formatMoney(_.sum(priceComponents.map((priceComponent) => priceComponent?.amount?.value ?? 0)));
}
