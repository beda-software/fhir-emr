import { Trans } from '@lingui/macro';
import { Empty, Table } from 'antd';
import _ from 'lodash';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isLoading } from 'fhir-react/lib/libs/remoteData';

import { PageContainer } from 'src/components/PageContainer';
import { SpinIndicator } from 'src/components/Spinner';
import { formatHumanDateTime } from 'src/utils/date';

import { useInvoicesList } from './hooks';
import { InvoiceStatus, InvoiceAmount, InvoiceActions } from './tableUtils';
import { getPractitionerName, getInvoicePractitioner, getPatientName, getInvoicePatient } from './utils';

export function InvoiceList() {
    const { invoiceResponse, pagination, handleTableChange, pagerManager } = useInvoicesList();
    return (
        <PageContainer
            title="Invoices"
            content={
                <RenderRemoteData remoteData={invoiceResponse}>
                    {({ invoices, practitioners, practitionerRoles, patients }) => (
                        <Table
                            pagination={pagination}
                            onChange={handleTableChange}
                            bordered
                            locale={{
                                emptyText: (
                                    <>
                                        <Empty
                                            description={<Trans>No data</Trans>}
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    </>
                                ),
                            }}
                            dataSource={invoices}
                            columns={[
                                {
                                    title: <Trans>Practitioner</Trans>,
                                    dataIndex: 'practitioner',
                                    key: 'practitioner',
                                    width: '20%',
                                    render: (_text, resource) =>
                                        getPractitionerName(
                                            getInvoicePractitioner(resource, practitioners, practitionerRoles),
                                        ),
                                },
                                {
                                    title: <Trans>Patient</Trans>,
                                    dataIndex: 'patient',
                                    key: 'patient',
                                    width: '20%',
                                    render: (_text, resource) => getPatientName(getInvoicePatient(resource, patients)),
                                },
                                {
                                    title: <Trans>Date</Trans>,
                                    dataIndex: 'date',
                                    key: 'date',
                                    width: '15%',
                                    render: (_text, resource) => formatHumanDateTime(resource.date ?? ''),
                                },
                                {
                                    title: <Trans>Status</Trans>,
                                    dataIndex: 'status',
                                    key: 'status',
                                    width: '10%',
                                    render: (_text, resource) => <InvoiceStatus invoice={resource} />,
                                },
                                {
                                    title: <Trans>Amount</Trans>,
                                    dataIndex: 'amount',
                                    key: 'amount',
                                    width: '10%',
                                    render: (_text, resource) => <InvoiceAmount invoice={resource} />,
                                },
                                {
                                    title: <Trans>Actions</Trans>,
                                    dataIndex: 'actions',
                                    key: 'actions',
                                    width: '20%',
                                    render: (_text, resource) => (
                                        <InvoiceActions manager={pagerManager} invoice={resource} />
                                    ),
                                },
                            ]}
                            loading={isLoading(invoiceResponse) && { indicator: SpinIndicator }}
                        />
                    )}
                </RenderRemoteData>
            }
        />
    );
}
