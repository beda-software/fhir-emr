import { t, Trans } from '@lingui/macro';
import { Empty, Table } from 'antd';
import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { renderHumanName } from 'shared/src/utils/fhir';

import { PageContainer } from 'src/components/PageContainer';
import { SpinIndicator } from 'src/components/Spinner';
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

function getInvoicePractitioner(
    invoice: Invoice,
    practitioners: Practitioner[],
    practitionerRoles: PractitionerRole[],
): Practitioner | undefined {
    const invoicePractitionerRoleParticipant = invoice.participant?.find(
        (participant) => participant.actor.reference?.split('/')?.[0] === 'PractitionerRole',
    );
    const invoicePractitionerRole = practitionerRoles.find(
        (practitionerRole) =>
            practitionerRole.id === invoicePractitionerRoleParticipant?.actor?.reference?.split('/')?.[1],
    );
    return practitioners.find(
        (practitioner) => practitioner.id === invoicePractitionerRole?.practitioner?.reference?.split('/')?.[1],
    );
}

function getInvoicePatient(invoice: Invoice, patients: Patient[]): Patient | undefined {
    const invoicePatientId = invoice.subject?.reference?.split('/')?.[1];
    return patients.find((patient) => patient.id === invoicePatientId);
}

function getPractitionerName(practitioner?: Practitioner): string {
    return practitioner ? renderHumanName(practitioner.name?.[0]) : 'Does not exist';
}

function getPatientName(patient?: Patient): string {
    return patient ? renderHumanName(patient?.name?.[0]) : 'Does not exist';
}

export function InvoiceList() {
    const { invoiceResponse, pagination, handleTableChange } = useInvoicesList();
    console.log('invoice', invoiceResponse);
    return (
        <PageContainer
            title="Invoices"
            content={
                <Table
                    pagination={pagination}
                    onChange={handleTableChange}
                    bordered
                    locale={{
                        emptyText: (
                            <>
                                <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </>
                        ),
                    }}
                    dataSource={isSuccess(invoiceResponse) ? invoiceResponse.data.invoices : []}
                    columns={[
                        {
                            title: <Trans>Practitioner</Trans>,
                            dataIndex: 'practitioner',
                            key: 'practitioner',
                            width: '20%',
                            render: (_text, resource) => {
                                if (isSuccess(invoiceResponse)) {
                                    return getPractitionerName(
                                        getInvoicePractitioner(
                                            resource,
                                            invoiceResponse.data.practitioners,
                                            invoiceResponse.data.practitionerRoles,
                                        ),
                                    );
                                }
                                return resource.id;
                            },
                        },
                        {
                            title: <Trans>Patient</Trans>,
                            dataIndex: 'patient',
                            key: 'patient',
                            width: '20%',
                            render: (_text, resource) => {
                                if (isSuccess(invoiceResponse)) {
                                    return getPatientName(getInvoicePatient(resource, invoiceResponse.data.patients));
                                }
                                return resource.id;
                            },
                        },
                        {
                            title: <Trans>Date</Trans>,
                            dataIndex: 'date',
                            key: 'date',
                            width: '20%',
                            render: (_text, resource) => resource.date,
                        },
                        {
                            title: <Trans>Status</Trans>,
                            dataIndex: 'status',
                            key: 'status',
                            width: '20%',
                            render: (_text, resource) => resource.status,
                        },
                        // {
                        //     title: <Trans>Actions</Trans>,
                        //     dataIndex: 'actions',
                        //     key: 'actions',
                        //     width: '20%',
                        //     render: (_text, resource) => (
                        //         <Row>
                        //             <Col>
                        //                 <ModalEditHealthcareService
                        //                     onSuccess={pagerManager.reload}
                        //                     healthcareService={resource}
                        //                 />
                        //             </Col>
                        //             <Col>
                        //                 <ModalChangeActiveHealthcareService
                        //                     onSuccess={pagerManager.reload}
                        //                     healthcareService={resource}
                        //                 />
                        //             </Col>
                        //         </Row>
                        //     ),
                        // },
                    ]}
                    loading={isLoading(invoiceResponse) && { indicator: SpinIndicator }}
                />
            }
        />
    );
}
