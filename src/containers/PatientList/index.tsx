import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { Bundle, Consent, Patient } from 'fhir/r4b';

import { extractBundleResources, parseFHIRReference, SearchParams } from '@beda.software/fhir-react';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage, navigationAction, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { formatHumanDate } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { getPatientSearchParamsForPractitioner } from './utils';

function PatientListConsent(props: { searchParams: SearchParams }) {
    const getFilters = (): SearchBarColumn[] => [
        {
            id: 'name',
            searchParam: 'patient:Patient.name',
            type: SearchBarColumnType.STRING,
            placeholder: t`Find patient`,
            placement: ['search-bar', 'table'],
        },
    ];

    const getPatientFromConsent = (consent: Consent, bundle: Bundle): Patient | undefined => {
        const patients = (extractBundleResources(bundle).Patient ?? []) as Patient[];
        const patientRef = consent.patient;
        if (!patientRef) return undefined;
        const patientId = parseFHIRReference(patientRef).id;
        return patients.find((p) => p.id === patientId);
    };

    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Consent>> => [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            render: (_text, record) =>
                renderHumanName(getPatientFromConsent(record.resource, record.bundle)?.name?.[0]),
            width: 300,
        },
        {
            title: <Trans>Birth date</Trans>,
            dataIndex: 'birthDate',
            key: 'birthDate',
            render: (_text, record) => {
                const patient = getPatientFromConsent(record.resource, record.bundle);
                return patient?.birthDate ? formatHumanDate(patient.birthDate) : null;
            },
            width: 150,
        },
        {
            title: <Trans>SSN</Trans>,
            dataIndex: 'identifier',
            key: 'identifier',
            render: (_text, record) => {
                const patient = getPatientFromConsent(record.resource, record.bundle);
                return patient?.identifier?.find(({ system }) => system === 'http://hl7.org/fhir/sid/us-ssn')?.value;
            },
            width: 250,
        },
    ];

    const getRecordActions = (record: RecordType<Consent>, _manager: TableManager) => {
        const patient = getPatientFromConsent(record.resource, record.bundle);
        return [
            navigationAction(<Trans>Open</Trans>, `/patients/${patient?.id}`),
            questionnaireAction(<Trans>Edit</Trans>, 'patient-edit'),
        ];
    };

    const getHeaderActions = () => [
        questionnaireAction(<Trans>Add patient</Trans>, 'patient-create', { icon: <PlusOutlined /> }),
    ];

    return (
        <ResourceListPage<Consent>
            headerTitle={t`Patients`}
            resourceType="Consent"
            searchParams={{
                ...props.searchParams,
                _sort: '-_lastUpdated,_id',
                _count: 10,
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}

function PatientListDefault(props: { searchParams: SearchParams }) {
    const getFilters = (): SearchBarColumn[] => [
        {
            id: 'name',
            searchParam: 'name',
            type: SearchBarColumnType.STRING,
            placeholder: t`Find patient`,
            placement: ['search-bar', 'table'],
        },
    ];

    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Patient>> => [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            render: (_text, record) => renderHumanName(record.resource.name?.[0]),
            width: 300,
        },
        {
            title: <Trans>Birth date</Trans>,
            dataIndex: 'birthDate',
            key: 'birthDate',
            render: (_text, record) => (record.resource.birthDate ? formatHumanDate(record.resource.birthDate) : null),
            width: 150,
        },
        {
            title: <Trans>SSN</Trans>,
            dataIndex: 'identifier',
            key: 'identifier',
            render: (_text, record) =>
                record.resource.identifier?.find(({ system }) => system === 'http://hl7.org/fhir/sid/us-ssn')?.value,
            width: 250,
        },
    ];

    const getRecordActions = (record: RecordType<Patient>, _manager: TableManager) => [
        navigationAction(<Trans>Open</Trans>, `/patients/${record.resource.id}`),
        questionnaireAction(<Trans>Edit</Trans>, 'patient-edit'),
    ];

    const getHeaderActions = () => [
        questionnaireAction(<Trans>Add patient</Trans>, 'patient-create', { icon: <PlusOutlined /> }),
    ];

    return (
        <ResourceListPage<Patient>
            headerTitle={t`Patients`}
            resourceType="Patient"
            searchParams={{
                ...props.searchParams,
                _sort: '-_lastUpdated,_id',
                _count: 10,
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}

export function PatientList() {
    const roleSearchParams = matchCurrentUserRole({
        [Role.Admin]: () => {
            return {};
        },
        [Role.Practitioner]: (practitioner) => {
            return getPatientSearchParamsForPractitioner(practitioner.id);
        },
        [Role.Receptionist]: () => {
            return {};
        },
        [Role.Patient]: () => {
            return {};
        },
    });

    const forPractitioner = matchCurrentUserRole({
        [Role.Admin]: () => {
            return false;
        },
        [Role.Practitioner]: (practitioner) => {
            return true;
        },
        [Role.Receptionist]: () => {
            return false;
        },
        [Role.Patient]: () => {
            return false;
        },
    });

    return forPractitioner ? (
        <PatientListConsent searchParams={roleSearchParams} />
    ) : (
        <PatientListDefault searchParams={roleSearchParams} />
    );
}
