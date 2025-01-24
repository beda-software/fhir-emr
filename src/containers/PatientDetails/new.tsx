import { Encounter, Patient } from 'fhir/r4b';

import { ResourceListPage } from 'src/components';
import { DetailPage, Tab } from 'src/uberComponents/DetailPage';
import { compileAsFirst } from 'src/utils';

import { PatientOverview } from './PatientOverviewDynamic';

const getName = compileAsFirst<Patient, string>("Patient.name.given.first() + ' ' + Patient.name.family");

function PatientEncounter({ patient }: { patient: Patient }) {
    return (
        <ResourceListPage<Encounter>
            headerTitle="Encounters"
            resourceType="Encounter"
            searchParams={{ patient: patient.id! }}
            getTableColumns={() => [
                {
                    title: 'Practitioner',
                    dataIndex: 'practitioner',
                    key: 'practitioner',
                    render: (_text: any, { resource }) => JSON.stringify(resource.participant),
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (_text: any, { resource }) => {
                        return resource.status;
                    },
                },
                {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                    width: 250,
                    render: (_text: any, { resource }) => JSON.stringify(resource.period),
                },
            ]}
        />
    );
}

const tabs: Array<Tab<Patient>> = [
    {
        path: '',
        label: 'Overview',
        component: ({ resource }) => <PatientOverview patient={resource} />,
    },
    {
        path: 'encounter',
        label: 'Encounter',
        component: ({ resource }) => <PatientEncounter patient={resource} />,
    },
];

export function NewPatientDetails() {
    return (
        <DetailPage<Patient>
            resourceType="Patient"
            getSearchParams={({ id }) => ({ _id: id })}
            getTitle={({ resource, bundle }) => getName(resource, { bundle })!}
            tabs={tabs}
            basePath="patients2"
        />
    );
}
