import { t, Trans } from '@lingui/macro';
import { Patient } from 'fhir/r4b';

import { SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage } from 'src/uberComponents';
import { navigationAction, questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { formatHumanDate } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { getPatientSearchParamsForPractitioner } from './utils';

export function PatientResourceListExample() {
    /*
    This page is just an example how the page can be constructed using ResourceList
    */
    const searchParams = matchCurrentUserRole({
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

    return (
        <ResourceListPage<Patient>
            headerTitle={t`Patients`}
            resourceType="Patient"
            searchParams={searchParams}
            tableColumns={[
                {
                    title: <Trans>Name</Trans>,
                    dataIndex: 'name',
                    key: 'name',
                    render: (_text, { resource }) => renderHumanName(resource.name?.[0]),
                },
                {
                    title: <Trans>Birth date</Trans>,
                    dataIndex: 'birthDate',
                    key: 'birthDate',
                    render: (_text, { resource }) => (resource.birthDate ? formatHumanDate(resource.birthDate) : null),
                    width: '25%',
                },
                {
                    title: <Trans>SSN</Trans>,
                    dataIndex: 'identifier',
                    key: 'identifier',
                    render: (_text, { resource }) =>
                        resource.identifier?.find(({ system }) => system === 'http://hl7.org/fhir/sid/us-ssn')?.value,
                    width: '25%',
                },
            ]}
            searchBarColumns={[
                {
                    id: 'name',
                    type: SearchBarColumnType.STRING,
                    placeholder: t`Find patient`,
                },
            ]}
            getRecordActions={(record) => [
                navigationAction('Open', `/patients/${record.resource.id}`),
                questionnaireAction('Edit', 'patient-edit'),
            ]}
            getHeaderActions={() => [questionnaireAction('Add patient', 'patient-create')]}
            getBatchActions={() => [questionnaireAction('Delete patients', 'patients-batch-delete')]}
        ></ResourceListPage>
    );
}
