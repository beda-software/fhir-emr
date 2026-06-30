import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Bundle, Consent, Patient } from 'fhir/r4b';
import type { FhirResource, Resource } from 'fhir/r4b';

import { parseFHIRReference, SearchParams } from '@beda.software/fhir-react';

import { SearchBarColumn } from 'src/components/SearchBar/types';
import { ResourceListPage, navigationAction, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { FhirPathTableColumn, RecordType } from 'src/uberComponents/ResourceListPage/types';
import { getRecordClinicalContextDefault } from 'src/uberComponents/ResourceListPage/utils';
import { compileAsFirst, getResourceClinicalContext } from 'src/utils';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { getPatientSearchParamsForPractitioner, makePatientListFilters } from './utils';

const getHeaderActions = () => [
    questionnaireAction(<Trans>Add patient</Trans>, 'patient-create', { icon: <PlusOutlined /> }),
];

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
    getPatientId: (record: RecordType<R>) => string | undefined,
): FhirPathTableColumn<R>[] {
    return [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            width: 300,
            getter: "Bundle.entry.resource.where(resourceType='Patient' and id=%patientId).first().name.first()",
            getterSource: 'bundle',
            getContext: (record) => ({ patientId: getPatientId(record) }),
        },
        {
            title: <Trans>Birth date</Trans>,
            dataIndex: 'birthDate',
            key: 'birthDate',
            width: 150,
            getter: "Bundle.entry.resource.where(resourceType='Patient' and id=%patientId).first().birthDate",
            getterSource: 'bundle',
            getContext: (record) => ({ patientId: getPatientId(record) }),
        },
        {
            title: <Trans>SSN</Trans>,
            dataIndex: 'identifier',
            key: 'identifier',
            width: 250,
            getter:
                "Bundle.entry.resource.where(resourceType='Patient' and id=%patientId).first().identifier.where(system='http://hl7.org/fhir/sid/us-ssn').value.first()",
            getterSource: 'bundle',
            getContext: (record) => ({ patientId: getPatientId(record) }),
        },
    ];
}

function buildPatientColumns(): FhirPathTableColumn<Patient>[] {
    return [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            width: 300,
            getter: 'Patient.name.first()',
        },
        {
            title: <Trans>Birth date</Trans>,
            dataIndex: 'birthDate',
            key: 'birthDate',
            width: 150,
            getter: 'Patient.birthDate',
        },
        {
            title: <Trans>SSN</Trans>,
            dataIndex: 'identifier',
            key: 'identifier',
            width: 250,
            getter: "Patient.identifier.where(system='http://hl7.org/fhir/sid/us-ssn').value.first()",
        },
    ];
}

function PatientListConsent(props: { searchParams: SearchParams }) {
    const getFilters = (): SearchBarColumn[] =>
        makePatientListFilters(
            'patient:Patient.name:contains',
            'patient:Patient._has:QuestionnaireResponse:subject:questionnaire',
        );
    const getTableColumns = (): FhirPathTableColumn<Consent>[] =>
        buildColumns<Consent>((record) => {
            const patientRef = record.resource.patient;
            return patientRef ? parseFHIRReference(patientRef).id : undefined;
        });

    const getRecordActions = (record: RecordType<Consent>) => {
        const patient = getPatientFromConsent(record.resource, record.bundle);
        return [
            navigationAction(<Trans>Chart</Trans>, `/patients/${patient?.id}`),
            navigationAction(<Trans>Forms</Trans>, `/patients/${patient?.id}/forms`),
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
            getClinicalContext={(record) => {
                if (!record) {
                    return getResourceClinicalContext('Patient', {} as FhirResource);
                }
                const { resource, bundle } = record;
                const patient = getPatientFromConsent(resource, bundle);
                return patient ? getResourceClinicalContext('Patient', patient) : [];
            }}
        />
    );
}

function PatientListDefault(props: { searchParams: SearchParams }) {
    const getFilters = (): SearchBarColumn[] =>
        makePatientListFilters('name:contains', '_has:QuestionnaireResponse:subject:questionnaire');
    const getTableColumns = (): FhirPathTableColumn<Patient>[] => buildPatientColumns();

    const getRecordActions = (record: RecordType<Patient>) => [
        navigationAction(<Trans>Chart</Trans>, `/patients/${record.resource.id}`),
        navigationAction(<Trans>Forms</Trans>, `/patients/${record.resource.id}/forms`),
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
            getClinicalContext={(record) => {
                return getRecordClinicalContextDefault(record);
            }}
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
        [Role.Practitioner]: () => {
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
