import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { Bundle, Consent, HumanName, Patient } from 'fhir/r4b';
import type { Resource } from 'fhir/r4b';

import { parseFHIRReference, SearchParams } from '@beda.software/fhir-react';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage, navigationAction, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';
import { formatHumanDate } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { getPatientSearchParamsForPractitioner } from './utils';

// Shared helpers to remove duplication
const makeFilters = (searchParam: string): SearchBarColumn[] => [
    {
        id: 'name',
        searchParam,
        type: SearchBarColumnType.STRING,
        placeholder: t`Find patient`,
        placement: ['search-bar', 'table'],
    },
];

const getHeaderActions = () => [
    questionnaireAction(<Trans>Add patient</Trans>, 'patient-create', { icon: <PlusOutlined /> }),
];

const getPatientName = compileAsFirst<Patient, HumanName>('Patient.name.first()');
const getBirthDate = compileAsFirst<Patient, string>('Patient.birthDate');
const getSSN = compileAsFirst<Patient, string>(
    "Patient.identifier.where(system='http://hl7.org/fhir/sid/us-ssn').value.first()",
);

const findPatientInBundleById = compileAsFirst<Bundle, Patient>(
    "Bundle.entry.resource.where(resourceType='Patient' and id=%patientId).first()",
);

function getPatientFromConsent(consent: Consent, bundle: Bundle): Patient | undefined {
    const patientRef = consent.patient;
    if (!patientRef) {
        return undefined;
    }
    const patientId = parseFHIRReference(patientRef).id;
    return findPatientInBundleById(bundle, { patientId });
}

function buildColumns<R extends Resource>(
    resolvePatient: (record: RecordType<R>) => Patient | undefined,
): ColumnsType<RecordType<R>> {
    return [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            render: (_text, record) => {
                const patient = resolvePatient(record);
                const name = patient ? getPatientName(patient) : undefined;
                return renderHumanName(name);
            },
            width: 300,
        },
        {
            title: <Trans>Birth date</Trans>,
            dataIndex: 'birthDate',
            key: 'birthDate',
            render: (_text, record) => {
                const patient = resolvePatient(record);
                const birthDate = patient ? getBirthDate(patient) : undefined;
                return birthDate ? formatHumanDate(birthDate) : null;
            },
            width: 150,
        },
        {
            title: <Trans>SSN</Trans>,
            dataIndex: 'identifier',
            key: 'identifier',
            render: (_text, record) => {
                const patient = resolvePatient(record);
                return patient ? getSSN(patient) : undefined;
            },
            width: 250,
        },
    ];
}

function PatientListConsent(props: { searchParams: SearchParams }) {
    const getFilters = (): SearchBarColumn[] => makeFilters('patient:Patient.name');
    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Consent>> =>
        buildColumns<Consent>((record) => getPatientFromConsent(record.resource, record.bundle));

    const getRecordActions = (record: RecordType<Consent>, _manager: TableManager) => {
        const patient = getPatientFromConsent(record.resource, record.bundle);
        return [
            navigationAction(<Trans>Open</Trans>, `/patients/${patient?.id}`),
            questionnaireAction(<Trans>Edit</Trans>, 'patient-edit'),
        ];
    };

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
    const getFilters = (): SearchBarColumn[] => makeFilters('name');
    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Patient>> =>
        buildColumns<Patient>((record) => record.resource);

    const getRecordActions = (record: RecordType<Patient>, _manager: TableManager) => [
        navigationAction(<Trans>Open</Trans>, `/patients/${record.resource.id}`),
        questionnaireAction(<Trans>Edit</Trans>, 'patient-edit'),
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
