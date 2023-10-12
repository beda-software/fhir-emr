import { Table } from 'antd';
import _ from 'lodash';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BasePageContent } from 'src/components/BaseLayout';
import { Spinner } from 'src/components/Spinner';
import { getFHIRReferenceResourceId } from 'src/utils/reference';

import { InvoiceDetailsHeader } from './components/InvoiceDetailsHeader';
import { useInvoiceDetails, useInvoiceLineItems } from './hooks';
import { InvoiceDetailsLineItemsProps } from './types';
import { formatMoney } from '../InvoiceList/utils';

export function InvoiceDetails() {
    const { id } = useParams<{ id: string }>();
    const { invoiceDetailsResponse } = useInvoiceDetails(id);

    return (
        <RenderRemoteData remoteData={invoiceDetailsResponse} renderLoading={Spinner}>
            {({ invoice, patient, practitioner }) => (
                <>
                    <InvoiceDetailsHeader invoice={invoice} patient={patient} practitioner={practitioner} />
                    <BasePageContent>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <Outlet />
                                    </>
                                }
                            >
                                <Route path="/" element={<LineItemsTable invoice={invoice} />} />
                            </Route>
                        </Routes>
                    </BasePageContent>
                </>
            )}
        </RenderRemoteData>
    );
}

function LineItemsTable(props: InvoiceDetailsLineItemsProps) {
    const [response] = useInvoiceLineItems(props);
    const lineItems = props.invoice.lineItem?.map((lineItem) => {
        return {
            id: getFHIRReferenceResourceId(lineItem.chargeItemReference),
            tax: lineItem.priceComponent?.filter((priceComponent) => priceComponent.type === 'tax'),
            base: lineItem.priceComponent?.filter((priceComponent) => priceComponent.type === 'base'),
            amount: _.sum(lineItem.priceComponent?.map((priceComponent) => priceComponent.amount?.value)),
        };
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(data) => (
                <Table
                    pagination={false}
                    bordered
                    dataSource={lineItems}
                    columns={[
                        {
                            title: 'Item',
                            dataIndex: 'item',
                            key: 'item',
                            render: (_text, resource) => {
                                const currentName = data.find((item) => item.id === resource.id)?.serviceName;
                                return currentName;
                            },
                        },
                        {
                            title: 'Quantity',
                            dataIndex: 'quantity',
                            key: 'quantity',
                            align: 'right',
                            render: () => 1,
                        },
                        {
                            title: 'Rate',
                            dataIndex: 'rate',
                            key: 'rate',
                            align: 'right',
                            render: (_text, resource) => formatMoney(resource.base?.[0]?.amount?.value ?? 0),
                        },
                        {
                            title: 'Tax',
                            dataIndex: 'tax',
                            key: 'tax',
                            align: 'right',
                            render: (_text, resource) => formatMoney(resource.tax?.[0]?.amount?.value ?? 0),
                        },
                        {
                            title: 'Amount',
                            dataIndex: 'amount',
                            key: 'amount',
                            align: 'right',
                            render: (_text, resource) => formatMoney(resource.amount),
                        },
                    ]}
                    footer={() => (
                        <InvoiceTableFooter totalAmount={_.sum(lineItems?.map((lineItem) => lineItem.amount))} />
                    )}
                />
            )}
        </RenderRemoteData>
    );
}

function InvoiceTableFooter({ totalAmount }: { totalAmount: number }) {
    return (
        <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
            <div>Total</div>
            <div>{formatMoney(totalAmount)}</div>
        </div>
    );
}
