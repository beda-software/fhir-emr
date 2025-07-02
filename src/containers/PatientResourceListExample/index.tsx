import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Patient } from 'fhir/r4b';

import { SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage } from 'src/uberComponents';
import { customAction, navigationAction, questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { formatHumanDate } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { S } from './styles';
import { getPatientSearchParamsForPractitioner } from './utils';

export function PatientResourceListExample() {
    /*
    This page is just an example how the page can be constructed using ResourceList
    */
    const searchParams = matchCurrentUserRole({
        [Role.Admin]: () => {
            return { _count: 33 };
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

    return (
        <ResourceListPage<Patient>
            headerTitle={t`Patients`}
            resourceType="Patient"
            searchParams={searchParams}
            getTableColumns={() => [
                {
                    title: <Trans>Name</Trans>,
                    dataIndex: 'name',
                    key: 'name',
                    render: (_text, { resource }) => renderHumanName(resource.name?.[0]),
                    width: 300,
                },
                {
                    title: <Trans>Birth date</Trans>,
                    dataIndex: 'birthDate',
                    key: 'birthDate',
                    render: (_text, { resource }) => (resource.birthDate ? formatHumanDate(resource.birthDate) : null),
                    width: 150,
                },
                {
                    title: <Trans>Gender</Trans>,
                    dataIndex: 'gender',
                    key: 'gender',
                    render: (_text, { resource }) => resource.gender,
                    width: 150,
                },
                {
                    title: <Trans>SSN</Trans>,
                    dataIndex: 'identifier',
                    key: 'identifier',
                    render: (_text, { resource }) =>
                        resource.identifier?.find(({ system }) => system === 'http://hl7.org/fhir/sid/us-ssn')?.value,
                    width: 250,
                },
            ]}
            getFilters={() => [
                {
                    id: 'name',
                    searchParam: 'name',
                    type: SearchBarColumnType.STRING,
                    placeholder: t`Find patient`,
                    placement: ['search-bar', 'table'],
                },
                {
                    id: 'birthDate',
                    searchParam: 'birthdate',
                    type: SearchBarColumnType.SINGLEDATE,
                    placeholder: t`Birth date`,
                    placement: ['table'],
                },
                {
                    id: 'gender',
                    searchParam: 'gender',
                    type: SearchBarColumnType.CHOICE,
                    placeholder: t`Choose gender`,
                    options: [
                        {
                            value: {
                                Coding: {
                                    code: 'male',
                                    display: 'Male',
                                },
                            },
                        },
                        {
                            value: {
                                Coding: {
                                    code: 'female',
                                    display: 'Female',
                                },
                            },
                        },
                    ],
                    placement: ['table'],
                },
            ]}
            getRecordActions={(record) => [
                navigationAction('Open', `/patients/${record.resource.id}`),
                questionnaireAction('Edit', 'patient-edit'),
                customAction(<S.LinkButton type="link">Custom action</S.LinkButton>),
            ]}
            getHeaderActions={() => [
                questionnaireAction(<Trans>Add patient</Trans>, 'patient-create', { icon: <PlusOutlined /> }),
            ]}
            getBatchActions={() => [questionnaireAction(<Trans>Delete patients</Trans>, 'patients-batch-delete')]}
            getReportColumns={(bundle) => [
                {
                    title: t`Number of Patients`,
                    value: bundle.total,
                },
            ]}
        ></ResourceListPage>
    );
}
