import { t, Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { Encounter, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { extractBundleResources, parseFHIRReference } from '@beda.software/fhir-react';

import { StatusBadge } from 'src/components/EncounterStatusBadge';
import { ResourceListPage, navigationAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { formatPeriodDateTime } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { getEncounterListSearchBarColumns } from './searchBarUtils';

function getEncounterPractitioner(
    encounter: Encounter,
    practitionerRoleList: PractitionerRole[],
    practitionerList: Practitioner[],
): Practitioner | undefined {
    const individualReference = encounter.participant?.[0]!.individual;
    if (!individualReference) {
        return undefined;
    }
    const individualReferenceResourceType = parseFHIRReference(individualReference).resourceType;

    if (individualReferenceResourceType === 'PractitionerRole') {
        const practitionerRole = practitionerRoleList.find(
            (practitionerRole) =>
                encounter.participant?.[0]!.individual &&
                practitionerRole.id === parseFHIRReference(encounter.participant?.[0]!.individual).id,
        );

        return practitionerList.find(
            (practitioner) =>
                practitionerRole?.practitioner &&
                practitioner.id === parseFHIRReference(practitionerRole?.practitioner).id,
        );
    }

    if (individualReferenceResourceType === 'Practitioner') {
        return practitionerList.find((practitioner) => {
            const reference = encounter.participant?.[0]!.individual;
            if (!reference) {
                return false;
            }

            return practitioner.id === parseFHIRReference(reference).id;
        });
    }

    return undefined;
}

function extractEncounterData(encounter: Encounter, bundle: any) {
    const sourceMap = extractBundleResources(bundle);
    const {
        Patient: patients = [],
        Practitioner: practitioners = [],
        PractitionerRole: practitionerRoles = [],
    } = sourceMap;

    const patient = patients.find(
        (patient) => encounter.subject && patient.id === parseFHIRReference(encounter.subject).id,
    ) as Patient | undefined;

    const practitioner = getEncounterPractitioner(
        encounter,
        practitionerRoles as PractitionerRole[],
        practitioners as Practitioner[],
    );

    return {
        patient,
        practitioner,
    };
}

export function EncounterList() {
    const roleSearchParams = matchCurrentUserRole({
        [Role.Admin]: () => {
            return {};
        },
        [Role.Patient]: () => {
            return {};
        },
        [Role.Practitioner]: (practitioner) => {
            return { participant: practitioner.id };
        },
        [Role.Receptionist]: () => {
            return {};
        },
    });

    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Encounter>> => [
        {
            title: <Trans>Patient</Trans>,
            dataIndex: 'patient',
            key: 'patient',
            render: (_text: any, record: RecordType<Encounter>) => {
                const { patient } = extractEncounterData(record.resource, record.bundle);
                return renderHumanName(patient?.name?.[0]);
            },
        },
        {
            title: <Trans>Practitioner</Trans>,
            dataIndex: 'practitioner',
            key: 'practitioner',
            render: (_text: any, record: RecordType<Encounter>) => {
                const { practitioner } = extractEncounterData(record.resource, record.bundle);
                return renderHumanName(practitioner?.name?.[0]);
            },
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'status',
            key: 'status',
            render: (_text: any, record: RecordType<Encounter>) => <StatusBadge status={record.resource.status} />,
        },
        {
            title: <Trans>Date</Trans>,
            dataIndex: 'date',
            key: 'date',
            width: 220,
            render: (_text: any, record: RecordType<Encounter>) => formatPeriodDateTime(record.resource.period),
        },
    ];

    const getRecordActions = (record: RecordType<Encounter>, _manager: TableManager) => [
        navigationAction(
            <Trans>Open</Trans>,
            `/patients/${extractEncounterData(record.resource, record.bundle).patient?.id}/encounters/${
                record.resource.id
            }`,
        ),
        navigationAction(<Trans>Video call</Trans>, `/encounters/${record.resource.id}/video`),
    ];

    const getFilters = () => getEncounterListSearchBarColumns();

    const getSorters = () => [
        {
            id: 'date',
            searchParam: 'date',
            label: 'Date',
        },
    ];

    return (
        <ResourceListPage
            headerTitle={t`Encounters`}
            resourceType="Encounter"
            searchParams={{
                ...roleSearchParams,
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
            getFilters={getFilters}
            getSorters={getSorters}
        />
    );
}
