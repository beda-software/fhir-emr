import { t, Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { Bundle, Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { StatusBadge } from 'src/components/EncounterStatusBadge';
import { navigationAction, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';
import { compileAsFirst } from 'src/utils';
import { formatPeriodDateTime } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

interface Props {
    patient: Patient;
    searchParams?: SearchParams;
    hideCreateButton?: boolean;
}

// FHIRPath helpers
const getEncounterSubjectId = compileAsFirst<Encounter, string>("Encounter.subject.reference.split('/').last()");
const getEncounterParticipantType = compileAsFirst<Encounter, string>(
    "Encounter.participant.first().individual.reference.split('/').first()",
);
const getEncounterParticipantId = compileAsFirst<Encounter, string>(
    "Encounter.participant.first().individual.reference.split('/').last()",
);

const findPatientInBundleById = compileAsFirst<Bundle, Patient>(
    "Bundle.entry.resource.where(resourceType='Patient' and id=%id).first()",
);
const findPractitionerInBundleById = compileAsFirst<Bundle, Practitioner>(
    "Bundle.entry.resource.where(resourceType='Practitioner' and id=%id).first()",
);
const findPractitionerRoleInBundleById = compileAsFirst<Bundle, PractitionerRole>(
    "Bundle.entry.resource.where(resourceType='PractitionerRole' and id=%id).first()",
);
const getPractitionerIdFromRole = compileAsFirst<PractitionerRole, string>(
    "PractitionerRole.practitioner.reference.split('/').last()",
);

function findEncounterPatient(encounter: Encounter, bundle: Bundle): Patient | undefined {
    const id = getEncounterSubjectId(encounter);
    if (!id) return undefined;
    return findPatientInBundleById(bundle, { id });
}

function findEncounterPractitioner(encounter: Encounter, bundle: Bundle): Practitioner | undefined {
    const type = getEncounterParticipantType(encounter);
    const id = getEncounterParticipantId(encounter);
    if (!type || !id) return undefined;

    if (type === 'Practitioner') {
        return findPractitionerInBundleById(bundle, { id });
    }
    if (type === 'PractitionerRole') {
        const role = findPractitionerRoleInBundleById(bundle, { id });
        const practitionerId = role ? getPractitionerIdFromRole(role) : undefined;
        return practitionerId ? findPractitionerInBundleById(bundle, { id: practitionerId }) : undefined;
    }
    return undefined;
}

export const PatientEncounter = ({ patient, searchParams, hideCreateButton }: Props) => {
    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Encounter>> => [
        {
            title: <Trans>Practitioner</Trans>,
            dataIndex: 'practitioner',
            key: 'practitioner',
            render: (_text: any, record: RecordType<Encounter>) => {
                const practitioner = findEncounterPractitioner(record.resource, record.bundle as Bundle);
                return renderHumanName(practitioner?.name?.[0]);
            },
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'status',
            key: 'status',
            render: (_text: any, record: RecordType<Encounter>) => {
                return <StatusBadge status={record.resource.status} />;
            },
        },
        {
            title: <Trans>Date</Trans>,
            dataIndex: 'date',
            key: 'date',
            width: 250,
            render: (_text: any, record: RecordType<Encounter>) => formatPeriodDateTime(record.resource.period),
        },
    ];

    const getRecordActions = (record: RecordType<Encounter>, _manager: TableManager) => {
        const patientFromBundle = findEncounterPatient(record.resource, record.bundle as Bundle);

        return [
            navigationAction(
                <Trans>Open</Trans>,
                `/patients/${patientFromBundle?.id}/encounters/${record.resource.id}`,
            ),
            navigationAction(<Trans>Video call</Trans>, `/encounters/${record.resource.id}/video`),
        ];
    };

    const getHeaderActions = () => {
        if (hideCreateButton) return [];
        const title = matchCurrentUserRole({
            [Role.Admin]: () => t`Create Encounter`,
            [Role.Patient]: () => t`Request Appointment`,
            [Role.Practitioner]: () => t`Create Encounter`,
            [Role.Receptionist]: () => t`Create Encounter`,
        });
        return [questionnaireAction(title, 'encounter-create')];
    };

    const getSorters = () => [
        {
            id: 'date',
            searchParam: 'date',
            label: 'Date',
        },
    ];

    return (
        <ResourceListPageContent<Encounter>
            resourceType="Encounter"
            searchParams={{
                subject: patient.id,
                ...searchParams,
                _include: [
                    'Encounter:subject',
                    'Encounter:participant:PractitionerRole',
                    'Encounter:participant:Practitioner',
                    'PractitionerRole:practitioner:Practitioner',
                ],
                _sort: '-date,_id',
                _count: 10,
            }}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
            getSorters={getSorters}
            defaultLaunchContext={[{ name: 'Patient', resource: patient }]}
        />
    );
};
