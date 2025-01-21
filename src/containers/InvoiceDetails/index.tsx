import { Trans, t } from '@lingui/macro';
import _ from 'lodash';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Table } from 'src/components';
import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Spinner } from 'src/components/Spinner';
import { getFHIRReferenceResourceId } from 'src/utils/reference';

import { InvoiceDetailsHeader } from './components/InvoiceDetailsHeader';
import { useInvoiceDetails, useInvoiceLineItems } from './hooks';
import { S } from './InvoiceDetails.styles';
import { InvoiceDetailsLineItemsProps } from './types';
import { formatMoney } from '../InvoiceList/utils';

export function InvoiceDetails() {
    const { id } = useParams<{ id: string }>();
    const { invoiceDetailsResponse } = useInvoiceDetails(id);

    return (
        <RenderRemoteData remoteData={invoiceDetailsResponse} renderLoading={Spinner}>
            {({ invoice, patient, practitioner }) => (
                <PageContainer
                    layoutVariant="with-tabs"
                    title={<Trans>Medical Services Invoice</Trans>}
                    headerContent={
                        <InvoiceDetailsHeader invoice={invoice} patient={patient} practitioner={practitioner} />
                    }
                >
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
                </PageContainer>
            )}
        </RenderRemoteData>
    );
}

function LineItemsTable(props: InvoiceDetailsLineItemsProps) {
    const [response] = useInvoiceLineItems(props);
    const lineItems = props.invoice?.lineItem?.map((lineItem) => {
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
                            title: t`Item`,
                            dataIndex: 'item',
                            key: 'item',
                            render: (_text, resource) => {
                                const currentName = data.find((item) => item.id === resource.id)?.serviceName;
                                return currentName;
                            },
                        },
                        {
                            title: t`Quantity`,
                            dataIndex: 'quantity',
                            key: 'quantity',
                            align: 'right',
                            render: () => 1,
                        },
                        {
                            title: t`Rate`,
                            dataIndex: 'rate',
                            key: 'rate',
                            align: 'right',
                            render: (_text, resource) => formatMoney(resource.base?.[0]?.amount?.value ?? 0),
                        },
                        {
                            title: t`Tax`,
                            dataIndex: 'tax',
                            key: 'tax',
                            align: 'right',
                            render: (_text, resource) => formatMoney(resource.tax?.[0]?.amount?.value ?? 0),
                        },
                        {
                            title: t`Amount`,
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
        <S.InvoiceTableFooterContainer>
            <div>
                <Trans>Total</Trans>
            </div>
            <div>{formatMoney(totalAmount)}</div>
        </S.InvoiceTableFooterContainer>
    );
}
