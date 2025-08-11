import { t } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { InvoiceLineItem, Bundle, Invoice } from 'fhir/r4b';
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
    bundle: Bundle;
}

function getTableColumns(): ColumnsType<Record> {
    return [];
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
