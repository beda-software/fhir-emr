import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Encounter, Patient } from 'fhir/r4b';

import { SearchBarColumnType } from 'src/components/SearchBar/types';
import { navigationAction, questionnaireAction } from 'src/uberComponents';
import { ResourceDetailPage, Tab } from 'src/uberComponents/ResourceDetailPage';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';
import { compileAsFirst, formatPeriodDateTime } from 'src/utils';

import { PatientOverview } from './PatientOverviewDynamic';

const getName = compileAsFirst<Patient, string>("Patient.name.given.first() + ' ' + Patient.name.family");

function PatientEncounter({ patient }: { patient: Patient }) {
    return (
        <ResourceListPageContent<Encounter>
            resourceType="Encounter"
            searchParams={{ patient: patient.id! }}
            getTableColumns={() => [
                {
                    title: 'Practitioner',
                    dataIndex: 'practitioner',
                    key: 'practitioner',
                    render: (_text: any, { resource }) => resource.participant?.[0]?.individual?.display,
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
                    render: (_text: any, { resource }) => formatPeriodDateTime(resource.period),
                },
            ]}
            getFilters={() => [
                {
                    id: 'name',
                    searchParam: '_ilike',
                    type: SearchBarColumnType.STRING,
                    placeholder: t`Find encounter`,
                    placement: ['search-bar', 'table'],
                },
                {
                    id: 'status',
                    searchParam: 'status',
                    type: SearchBarColumnType.CHOICE,
                    placeholder: t`Choose status`,
                    options: [
                        {
                            value: {
                                Coding: {
                                    code: 'in-progress',
                                    display: 'In progress',
                                },
                            },
                        },
                        {
                            value: {
                                Coding: {
                                    code: 'finished',
                                    display: 'Finished',
                                },
                            },
                        },
                    ],
                    placement: ['table', 'search-bar'],
                },
            ]}
            getRecordActions={(record) => [navigationAction('Open', `/patients2/${record.resource.id}/encounter`)]}
            getHeaderActions={() => [
                questionnaireAction(<Trans>Create encounter</Trans>, 'encounter-create', { icon: <PlusOutlined /> }),
            ]}
            getBatchActions={() => [questionnaireAction(<Trans>Finish encounters</Trans>, '')]}
            getReportColumns={(bundle) => [
                {
                    title: t`Number of Encounters`,
                    value: bundle.total,
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
        <ResourceDetailPage<Patient>
            resourceType="Patient"
            getSearchParams={({ id }) => ({ _id: id })}
            getTitle={({ resource, bundle }) => getName(resource, { bundle })!}
            tabs={tabs}
        />
    );
}
