import { t, Trans } from '@lingui/macro';
import type { ColumnsType } from 'antd/lib/table';
import { Bundle, Medication, MedicationRequest, Patient, HumanName } from 'fhir/r4b';
import { extractCreatedAtFromMeta } from 'sdc-qrf';

//

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { ValueSetOption } from 'src/services';
import { ResourceListPage, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import type { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';
import { formatHumanDate } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role } from 'src/utils/role';

// Removed custom modals in favor of questionnaireAction

const MEDICATIONREQUEST_STATUS_SYSTEM = 'http://hl7.org/fhir/CodeSystem/medicationrequest-status';

function makeStatusOption(code: MedicationRequest['status'], display: string): ValueSetOption {
    return {
        value: {
            Coding: {
                system: MEDICATIONREQUEST_STATUS_SYSTEM,
                code,
                display,
            },
        },
    };
}

export function Prescriptions() {
    const getFilters = (): SearchBarColumn[] => {
        const baseFilters: SearchBarColumn[] = [
            {
                id: 'requester',
                searchParam: 'requester',
                type: SearchBarColumnType.STRING,
                placeholder: t`Requester`,
            },
            {
                id: 'status',
                searchParam: 'status',
                type: SearchBarColumnType.CHOICE,
                placeholder: t`Status`,
                options: (
                    [
                        ['active', t`Active`],
                        ['cancelled', t`Cancelled`],
                        ['completed', t`Completed`],
                        ['on-hold', t`On Hold`],
                        ['entered-in-error', t`Entered in error`],
                        ['stopped', t`Stopped`],
                        ['draft', t`Draft`],
                        ['unknown', t`Unknown`],
                    ] as Array<[MedicationRequest['status'], string]>
                ).map(([code, label]) => makeStatusOption(code, label)),
            },
        ];

        const withPatient = matchCurrentUserRole({
            [Role.Admin]: () => true,
            [Role.Patient]: () => false,
            [Role.Practitioner]: () => true,
            [Role.Receptionist]: () => true,
        });

        return withPatient
            ? [
                  {
                      id: 'patient',
                      type: SearchBarColumnType.REFERENCE,
                      placeholder: t`Patient`,
                      expression: 'Patient',
                      path: "name.given.first() + ' ' + name.family",
                  },
                  ...baseFilters,
              ]
            : baseFilters;
    };

    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<MedicationRequest>> => [
        {
            title: <Trans>Patient</Trans>,
            dataIndex: 'patient',
            key: 'patient',
            render: (_text, record) => {
                const patient = findPatient(record.resource, record.bundle);
                return renderHumanName(patient?.name?.[0]);
            },
        },
        {
            title: <Trans>Requester</Trans>,
            dataIndex: 'requester',
            key: 'requester',
            render: (_text, record) => {
                return getRequesterDisplay(record.resource, record.bundle);
            },
        },
        {
            title: <Trans>Medication</Trans>,
            dataIndex: 'medication',
            key: 'medication',
            render: (_text, record) => {
                const medication = findMedication(record.resource, record.bundle);
                const medicationName =
                    medication?.code?.coding?.[0]?.display ??
                    record.resource.medicationCodeableConcept?.coding?.[0]?.display ??
                    'Unknown';
                return medicationName;
            },
        },
        {
            title: <Trans>Batch Number</Trans>,
            dataIndex: 'batchNumber',
            key: 'batchNumber',
            render: (_text, record) => {
                const medication = findMedication(record.resource, record.bundle);
                return medication?.batch?.lotNumber ?? 'Unknown';
            },
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'status',
            key: 'status',
            render: (_text, record) => mapPrescriptionStatus(record.resource),
        },
        {
            title: <Trans>Date</Trans>,
            dataIndex: 'date',
            key: 'date',
            render: (_text, record) => {
                const createdAt = extractCreatedAtFromMeta(record.resource.meta);
                return createdAt ? formatHumanDate(createdAt) : null;
            },
        },
    ];

    const getRecordActions = (record: RecordType<MedicationRequest>, _manager: TableManager) => {
        const medication = findMedication(record.resource, record.bundle);
        const isActionAllowed = record.resource.status === 'active' && Boolean(medication);

        if (!isActionAllowed) {
            return [];
        }

        return [
            questionnaireAction(<Trans>Confirm</Trans>, 'medication-request-confirm', {
                extra: {
                    qrfProps: {
                        launchContextParameters: [
                            { name: 'MedicationRequest', resource: record.resource },
                            { name: 'Medication', resource: medication },
                        ],
                    },
                },
            }),
            questionnaireAction(<Trans>Cancel</Trans>, 'medication-request-cancel', {
                extra: {
                    qrfProps: {
                        launchContextParameters: [
                            { name: 'MedicationRequest', resource: record.resource },
                            { name: 'Medication', resource: medication },
                        ],
                    },
                },
            }),
        ];
    };

    return (
        <ResourceListPage<MedicationRequest>
            headerTitle={t`Prescriptions`}
            resourceType="MedicationRequest"
            searchParams={{
                _include: [
                    'MedicationRequest:subject:Patient',
                    'MedicationRequest:requester',
                    'MedicationRequest:medication:Medication',
                ],
                _sort: '-_createdAt,_id',
                _count: 10,
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
        />
    );
}

const getMedicationRequestMedicationId = compileAsFirst<MedicationRequest, string>(
    "MedicationRequest.medicationReference.reference.split('/').last()",
);
const findMedicationInBundleById = compileAsFirst<Bundle, Medication>(
    "Bundle.entry.resource.where(resourceType='Medication' and id=%id).first()",
);
function findMedication(medicationRequest: MedicationRequest, bundle: Bundle): Medication | undefined {
    const id = getMedicationRequestMedicationId(medicationRequest);
    console.log('medication id ', id);
    if (!id) {
        return undefined;
    }
    return findMedicationInBundleById(bundle, { id });
}

const getMedicationRequestPatientId = compileAsFirst<MedicationRequest, string>(
    "MedicationRequest.subject.reference.split('/').last()",
);
const findPatientInBundleById = compileAsFirst<Bundle, Patient>(
    "Bundle.entry.resource.where(resourceType='Patient' and id=%id).first()",
);
function findPatient(medicationRequest: MedicationRequest, bundle: Bundle): Patient | undefined {
    const id = getMedicationRequestPatientId(medicationRequest);
    if (!id) {
        return undefined;
    }
    return findPatientInBundleById(bundle, { id });
}

const getRequesterId = compileAsFirst<MedicationRequest, string>(
    "MedicationRequest.requester.reference.split('/').last()",
);
const getRequesterType = compileAsFirst<MedicationRequest, string>(
    "MedicationRequest.requester.reference.split('/').first()",
);
const findOrganizationNameById = compileAsFirst<Bundle, string>(
    "Bundle.entry.resource.where(resourceType='Organization' and id=%id).first().name",
);
const findPractitionerFirstName = compileAsFirst<Bundle, HumanName>(
    "Bundle.entry.resource.where(resourceType='Practitioner' and id=%id).first().name.first()",
);
function getRequesterDisplay(medicationRequest: MedicationRequest, bundle: Bundle): string | undefined {
    const id = getRequesterId(medicationRequest);
    const type = getRequesterType(medicationRequest);
    if (!id || !type) {
        return medicationRequest.id;
    }

    if (type === 'Organization') {
        return findOrganizationNameById(bundle, { id }) ?? medicationRequest.id;
    }
    if (type === 'Practitioner') {
        const name = findPractitionerFirstName(bundle, { id });
        return renderHumanName(name);
    }
    return medicationRequest.id;
}

function mapPrescriptionStatus(medicationRequest: MedicationRequest): string {
    const statusMap: Record<string, string> = {
        active: t`Active`,
        'on-hold': t`On Hold`,
        cancelled: t`Cancelled`,
        completed: t`Completed`,
        'entered-in-error': t`Entered in error`,
        stopped: t`Stopped`,
        draft: t`Draft`,
        unknown: t`Unknown`,
    };

    return statusMap[medicationRequest.status] ?? t`Unknown`;
}
