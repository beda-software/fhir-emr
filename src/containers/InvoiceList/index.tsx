import { t, Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { Invoice } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';

import { SearchBarColumn, SearchBarColumnType, SorterColumn } from 'src/components/SearchBar/types';
import { ResourceListPage, questionnaireAction, navigationAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { formatHumanDateTime } from 'src/utils';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { InvoiceAmount } from './components/InvoiceAmount';
import { InvoiceStatus } from './components/InvoiceStatus';
import { getPractitionerName, getInvoicePractitioner, getPatientName, getInvoicePatient } from './utils';

export function InvoiceList() {
    const getFilters = (): SearchBarColumn[] => [
        {
            id: 'status',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by status`,
        },
        {
            id: 'subject',
            type: SearchBarColumnType.REFERENCE,
            placeholder: t`Search by patient`,
            expression: 'Patient',
            path: "name.given.first() + ' ' + name.family",
        },
        {
            id: 'participant',
            type: SearchBarColumnType.REFERENCE,
            placeholder: t`Search by practitioner`,
            expression: 'PractitionerRole',
            path: 'practitioner.display',
        },
    ];

    const getSorters = (): SorterColumn[] => [
        {
            id: 'date',
            searchParam: 'date',
            label: t`Date`,
        },
        {
            id: 'status',
            searchParam: 'status',
            label: t`Status`,
        },
    ];

    const getTableColumns = (manager: TableManager): ColumnsType<RecordType<Invoice>> => [
        {
            title: <Trans>Practitioner</Trans>,
            dataIndex: 'practitioner',
            key: 'practitioner',
            width: '15%',
            render: (_text, record) => {
                const bundle = record.bundle;
                const practitioners = extractBundleResources(bundle).Practitioner;
                const practitionerRoles = extractBundleResources(bundle).PractitionerRole;
                return getPractitionerName(getInvoicePractitioner(record.resource, practitioners, practitionerRoles));
            },
        },
        {
            title: <Trans>Patient</Trans>,
            dataIndex: 'patient',
            key: 'patient',
            width: '15%',
            render: (_text, record) => {
                const bundle = record.bundle;
                const patients = extractBundleResources(bundle).Patient;
                return getPatientName(getInvoicePatient(record.resource, patients));
            },
        },
        {
            title: <Trans>Date</Trans>,
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            render: (_text, record) => formatHumanDateTime(record.resource.date),
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (_text, record) => <InvoiceStatus invoice={record.resource} />,
        },
        {
            title: <Trans>Amount</Trans>,
            dataIndex: 'amount',
            key: 'amount',
            width: '10%',
            render: (_text, record) => <InvoiceAmount invoice={record.resource} />,
        },
    ];

    const getRecordActions = (record: RecordType<Invoice>) => {
        const routeToOpen = record.resource.id!;

        const actions = [navigationAction(<Trans>Open</Trans>, routeToOpen)];

        // Add role-specific actions
        const roleSpecificActions = matchCurrentUserRole({
            [Role.Admin]: () => [
                questionnaireAction(<Trans>Cancel</Trans>, 'cancel-invoice'),
                questionnaireAction(<Trans>Pay</Trans>, 'pay-invoice'),
            ],
            [Role.Patient]: () => [], // Patients only see open action
            [Role.Practitioner]: () => [
                questionnaireAction(<Trans>Cancel</Trans>, 'cancel-invoice'),
                questionnaireAction(<Trans>Pay</Trans>, 'pay-invoice'),
            ],
            [Role.Receptionist]: () => [
                questionnaireAction(<Trans>Cancel</Trans>, 'cancel-invoice'),
                questionnaireAction(<Trans>Pay</Trans>, 'pay-invoice'),
            ],
        });

        return [...actions, ...roleSpecificActions];
    };

    return (
        <ResourceListPage
            headerTitle={t`Invoices`}
            resourceType="Invoice"
            searchParams={{
                _sort: '-_lastUpdated,_id',
                _count: 10,
                '_include:iterate': [
                    'Invoice:patient:Patient',
                    'Invoice:participant:PractitionerRole',
                    'PractitionerRole:practitioner:Practitioner',
                ],
            }}
            getFilters={getFilters}
            getSorters={getSorters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
        />
    );
}
