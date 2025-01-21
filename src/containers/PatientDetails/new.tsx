import { Patient } from 'fhir/r4b';

import { PatientEncounter } from 'src/components';
import { DetailPage, Tab } from 'src/uberComponents/DetailPage';
import { compileAsFirst } from 'src/utils';

import { PatientOverview } from './PatientOverviewDynamic';

const getName = compileAsFirst<Patient, string>("Patient.name.given.first() + ' ' + Patient.name.family");

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
            getTitle={({ resource }) => getName(resource)!}
            tabs={tabs}
            basePath="patients2"
        />
    );
}
