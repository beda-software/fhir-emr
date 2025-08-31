import { t } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { InvoiceLineItem, Bundle, Invoice, ChargeItemDefinition } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { extractBundleResources } from '@beda.software/fhir-react';

import { getInvoiceStatusHumanized } from 'src/containers/InvoiceList/components/InvoiceStatus';
import { ResourceListPage } from 'src/uberComponents/ResourceListPage';
import { ReportColumn } from 'src/uberComponents/ResourceListPage/types';
import { compileAsArray, compileAsFirst } from 'src/utils';
import { formatHumanDateTime } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';

import { formatMoney } from '../InvoiceList/utils';

const getLineItems = compileAsArray<Bundle, InvoiceLineItem>('Bundle.entry.resource.lineItem');
const getTotalAmount = compileAsFirst<Invoice, number>('Invoice.lineItem.priceComponent.amount.value.sum()');

// FHIRPath helpers for table columns
const getLineItemName = compileAsFirst<InvoiceLineItem, string>(
    '(chargeItemCodeableConcept.coding.display | chargeItemReference.display).first()',
);
const getLineItemRate = compileAsFirst<InvoiceLineItem, number>(
    "priceComponent.where(type = 'base').amount.value.sum()",
);
const getLineItemTax = compileAsFirst<InvoiceLineItem, number>("priceComponent.where(type = 'tax').amount.value.sum()");
const getLineItemAmount = compileAsFirst<InvoiceLineItem, number>('priceComponent.amount.value.sum()');

function getReportColumns(bundle: Bundle): ReportColumn[] {
    const resources = extractBundleResources(bundle);

    const invoice = resources.Invoice[0];
    const patient = resources.Patient[0];
    const practitioner = resources.Practitioner[0];

    const amount = invoice ? getTotalAmount(invoice) : undefined;

    return [
        { title: t`Patient`, value: renderHumanName(patient?.name?.[0]) },
        { title: t`Practitioner`, value: renderHumanName(practitioner?.name?.[0]) },
        { title: t`Date`, value: formatHumanDateTime(invoice?.date) },
        { title: t`Status`, value: getInvoiceStatusHumanized(invoice) },
        { title: t`Total`, value: amount ? formatMoney(amount) : '-' },
    ];
}

interface Record {
    resource: InvoiceLineItem;
    bundle: Bundle<ChargeItemDefinition>;
}

function getTableColumns(): ColumnsType<Record> {
    return [
        {
            title: t`Name`,
            dataIndex: 'name',
            key: 'name',
            render: (_text, record) => getLineItemName(record.resource) ?? '-',
        },
        {
            title: t`Quantity`,
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
            render: (_text, record) => 1,
        },
        {
            title: t`Rate`,
            dataIndex: 'rate',
            key: 'rate',
            width: '15%',
            render: (_text, record) => formatMoney(getLineItemRate(record.resource) ?? 0),
        },
        {
            title: t`Tax`,
            dataIndex: 'tax',
            key: 'tax',
            width: '15%',
            render: (_text, record) => formatMoney(getLineItemTax(record.resource) ?? 0),
        },
        {
            title: t`Amount`,
            dataIndex: 'amount',
            key: 'amount',
            width: '15%',
            render: (_text, record) => formatMoney(getLineItemAmount(record.resource) ?? 0),
        },
    ];
}

export function InvoiceDetails() {
    const { id } = useParams<{ id: string }>();
    return (
        <ResourceListPage<Invoice>
            headerTitle={t`Medical Services Invoice`}
            extractPrimaryResources={getLineItems as any}
            searchParams={{
                _id: id,
                _include: [
                    'Invoice:subject:Patient',
                    'Invoice:participant:PractitionerRole',
                    'PractitionerRole:practitioner:Practitioner',
                ],
            }}
            resourceType="Invoice"
            getTableColumns={getTableColumns as any}
            getReportColumns={getReportColumns}
        />
    );
}
