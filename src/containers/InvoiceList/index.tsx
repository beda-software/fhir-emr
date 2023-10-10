import { Trans } from '@lingui/macro';
import { Empty, Table } from 'antd';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isLoading } from 'fhir-react/lib/libs/remoteData';

import { PageContainer } from 'src/components/PageContainer';
import { SpinIndicator } from 'src/components/Spinner';
import { formatHumanDateTime } from 'src/utils/date';

import { InvoiceListSearchBar } from './components/InvoiceListSearchBar';
import { useInvoiceSearchBarSelect } from './components/InvoiceListSearchBar/hooks';
import { useInvoicesList } from './hooks';
import { InvoiceStatus, InvoiceAmount, InvoiceActions } from './tableUtils';
import { getPractitionerName, getInvoicePractitioner, getPatientName, getInvoicePatient } from './utils';
import { getSelectedValue } from '../OrganizationScheduling/utils';

export function InvoiceList() {
    const {
        selectedPatient,
        selectedPractitionerRole,
        selectedStatus,
        patientOptions,
        practitionerRoleOptions,
        statusOptions,
        onChange,
        resetFilter,
    } = useInvoiceSearchBarSelect();

    const { invoiceResponse, pagination, handleTableChange, pagerManager } = useInvoicesList(
        getSelectedValue(selectedPractitionerRole),
        getSelectedValue(selectedPatient),
        getSelectedValue(selectedStatus),
    );
    return (
        <PageContainer
            title="Invoices"
            headerContent={
                <InvoiceListSearchBar
                    selectedPatient={selectedPatient}
                    selectedPractitionerRole={selectedPractitionerRole}
                    selectedStatus={selectedStatus}
                    loadPatientOptions={patientOptions}
                    loadPractitionerRoleOptions={practitionerRoleOptions}
                    loadStatusOptions={statusOptions}
                    onChangePatient={(selectedOption) => onChange(selectedOption, 'patient')}
                    onChangePractitionerRole={(selectedOption) => onChange(selectedOption, 'practitionerRole')}
                    onChangeStatus={(selectedOption) => onChange(selectedOption, 'status')}
                    reset={resetFilter}
                />
            }
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
