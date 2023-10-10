import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    FormOutlined,
    InfoCircleOutlined,
    IssuesCloseOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Col, Empty, notification, Row, Table, Tag } from 'antd';
import { FhirResource, Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import _ from 'lodash';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { ModalTrigger } from 'src/components/ModalTrigger';
import { PageContainer } from 'src/components/PageContainer';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { SpinIndicator } from 'src/components/Spinner';
import { usePagerExtended } from 'src/hooks/pager';
import { formatHumanDateTime } from 'src/utils/date';

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
    const { invoiceResponse, pagination, handleTableChange, pagerManager } = useInvoicesList();
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
                            width: '15%',
                            render: (_text, resource) => formatHumanDateTime(resource.date ?? ''),
                        },
                        {
                            title: <Trans>Status</Trans>,
                            dataIndex: 'status',
                            key: 'status',
                            width: '10%',
                            render: (_text, resource) => {
                                const statusDataMapping = {
                                    balanced: {
                                        icon: <CheckCircleOutlined />,
                                        color: 'success',
                                        name: 'Balanced',
                                    },
                                    cancelled: {
                                        icon: <IssuesCloseOutlined />,
                                        color: 'warning',
                                        name: 'Cancelled',
                                    },
                                    issued: {
                                        icon: <InfoCircleOutlined />,
                                        color: 'processing',
                                        name: 'Issued',
                                    },
                                    draft: {
                                        icon: <FormOutlined />,
                                        color: 'default',
                                        name: 'Draft',
                                    },
                                    'entered-in-error': {
                                        icon: <StopOutlined />,
                                        color: 'error',
                                        name: 'Entered in error',
                                    },
                                };

                                const { icon, color, name } = statusDataMapping[resource.status];

                                return (
                                    <Tag icon={icon} color={color}>
                                        {name}
                                    </Tag>
                                );
                            },
                        },
                        {
                            title: <Trans>Amount</Trans>,
                            dataIndex: 'amount',
                            key: 'amount',
                            width: '10%',
                            render: (_text, resource) => {
                                const priceComponents = _.flatten(
                                    resource.lineItem?.map((lineItem) => lineItem.priceComponent),
                                );
                                return _.sum(
                                    priceComponents.map((priceComponent) => priceComponent?.amount?.value ?? 0),
                                );
                            },
                        },
                        {
                            title: <Trans>Actions</Trans>,
                            dataIndex: 'actions',
                            key: 'actions',
                            width: '20%',
                            render: (_text, resource) => {
                                return (
                                    <Row>
                                        <Col>
                                            <ModelCancelInvoice onSuccess={pagerManager.reload} invoice={resource} />
                                        </Col>
                                        <Col>
                                            <ModelPayInvoice onSuccess={pagerManager.reload} invoice={resource} />
                                        </Col>
                                    </Row>
                                );
                            },
                        },
                    ]}
                    loading={isLoading(invoiceResponse) && { indicator: SpinIndicator }}
                />
            }
        />
    );
}

interface ModelCancelInvoiceProps {
    onSuccess: () => void;
    invoice: Invoice;
}

function ModelCancelInvoice(props: ModelCancelInvoiceProps) {
    return (
        <ModalTrigger
            title={t`Cancel Invoice`}
            trigger={
                <Button type="link" disabled={props.invoice.status !== 'issued'}>
                    <span>
                        <Trans>Cancel</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('cancel-invoice')}
                    launchContextParameters={[{ name: 'Invoice', resource: props.invoice as FhirResource }]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Invoice was successfully cancelled` });
                        props.onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}

function ModelPayInvoice(props: ModelCancelInvoiceProps) {
    return (
        <ModalTrigger
            title={t`Payment`}
            trigger={
                <Button type="link" disabled={props.invoice.status !== 'issued'}>
                    <span>
                        <Trans>Payment</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('pay-invoice')}
                    launchContextParameters={[{ name: 'Invoice', resource: props.invoice as FhirResource }]}
                    onSuccess={() => {
                        closeModal();
                        notification.success({ message: t`Invoice was successfully payed` });
                        props.onSuccess();
                    }}
                    onCancel={closeModal}
                />
            )}
        </ModalTrigger>
    );
}
