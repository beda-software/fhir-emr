import { t, Trans } from '@lingui/macro';
import { Medication, MedicationRequest } from 'fhir/r4b';
import { extractExtension } from 'sdc-qrf';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { Table } from 'src/components';
import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Spinner } from 'src/components/Spinner';
import { formatHumanDate } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';
import { matchCurrentUserRole, Role, selectCurrentUserRoleResource } from 'src/utils/role';

import { PrescriptionsSearchBar } from './components/PrescriptionsSearchBar';
import { usePrescriptionsSearchBarSelect } from './components/PrescriptionsSearchBar/hooks';
import { useMedicationRequest } from './hooks';
import { ModalMedicationRequestCancel } from './ModalMedicationRequestCancel';
import { ModalMedicationRequestConfirm } from './ModalMedicationRequestConfirm';
import { getSelectedValue } from '../OrganizationScheduling/utils';

export function Prescriptions() {
    const {
        selectedPatient,
        selectedPractitionerRole,
        selectedStatus,
        patientOptions,
        practitionerRoleOptions,
        statusOptions,
        onChange,
        resetFilter,
    } = usePrescriptionsSearchBarSelect();

    const selectedPatientValue = matchCurrentUserRole({
        [Role.Admin]: () => getSelectedValue(selectedPatient),
        [Role.Patient]: () => selectCurrentUserRoleResource().id,
        [Role.Practitioner]: () => getSelectedValue(selectedPatient),
        [Role.Receptionist]: () => getSelectedValue(selectedPatient),
    });

    const { pagination, medicationRequestResponse, pagerManager, handleTableChange } = useMedicationRequest(
        getSelectedValue(selectedPractitionerRole),
        selectedPatientValue,
        getSelectedValue(selectedStatus),
    );

    return (
        <PageContainer
            title={t`Prescriptions`}
            layoutVariant="with-table"
            headerContent={
                <PrescriptionsSearchBar
                    selectedPatient={selectedPatient}
                    selectedPractitionerRole={selectedPractitionerRole}
                    selectedStatus={selectedStatus}
                    loadPatientOptions={patientOptions}
                    loadPractitionerRoleOptions={practitionerRoleOptions}
                    loadStatusOptions={statusOptions}
                    onChangePatient={(selectedOption) => onChange(selectedOption, 'patient')}
                    onChangePractitionerRole={(selectedOption) => onChange(selectedOption, 'practitionerRole')}
                    onChangeStatus={(selectedOption) => onChange(selectedOption, 'status')}
                    reset={resetFilter}
                />
            }
        >
            <RenderRemoteData remoteData={medicationRequestResponse} renderLoading={Spinner}>
                {({ patients, organizations, practitioners, medications, medicationRequests }) => {
                    return (
                        <Table
                            pagination={pagination}
                            onChange={handleTableChange}
                            dataSource={medicationRequests}
                            tableLayout={'auto'}
                            rowClassName={'valign-top'}
                            columns={[
                                {
                                    title: <Trans>Patient</Trans>,
                                    dataIndex: 'name',
                                    key: 'name',
                                    render: (_text, resource) =>
                                        renderHumanName(
                                            patients.find(
                                                (patient) => patient.id === resource.subject.reference?.split('/')?.[1],
                                            )?.name?.[0],
                                        ),
                                },
                                {
                                    title: <Trans>Requester</Trans>,
                                    dataIndex: 'requester',
                                    key: 'requester',
                                    render: (_text, resource) => {
                                        const requesterId = resource.requester?.reference?.split('/')?.[1];
                                        const requesterResourceType = resource.requester?.reference?.split('/')?.[0];
                                        if (requesterResourceType === 'Organization') {
                                            const currentOrganization = organizations.find(
                                                (organization) => organization.id === requesterId,
                                            );
                                            return currentOrganization?.name;
                                        }

                                        if (requesterResourceType === 'Practitioner') {
                                            const currentPractitioner = practitioners.find(
                                                (practitioner) => practitioner.id === requesterId,
                                            );
                                            return renderHumanName(currentPractitioner?.name?.[0]);
                                        }

                                        return resource.id;
                                    },
                                },
                                {
                                    title: <Trans>Medication</Trans>,
                                    dataIndex: 'medication',
                                    key: 'medication',
                                    render: (_text, resource) => {
                                        const medicationResource = findCurrentMedication(medications, resource);
                                        const medicationName = medicationResource
                                            ? medicationResource.code?.coding?.[0]?.display
                                            : resource?.medicationCodeableConcept?.coding?.[0]?.display;
                                        return medicationName ?? 'Unknown';
                                    },
                                },
                                {
                                    title: <Trans>Batch Number</Trans>,
                                    dataIndex: 'batchNumber',
                                    key: 'batchNumber',
                                    render: (_text, resource) =>
                                        findCurrentMedication(medications, resource)?.batch?.lotNumber ?? 'Unknown',
                                },
                                {
                                    title: <Trans>Status</Trans>,
                                    dataIndex: 'status',
                                    key: 'status',
                                    render: (_text, resource) => mapPrescriptionStatus(resource),
                                },
                                {
                                    title: <Trans>Date</Trans>,
                                    dataIndex: 'date',
                                    key: 'date',
                                    render: (_text, resource) => {
                                        const createdAt = extractExtension(resource.meta?.extension, 'ex:createdAt');

                                        return createdAt ? formatHumanDate(createdAt) : null;
                                    },
                                },
                                {
                                    title: <Trans>Actions</Trans>,
                                    dataIndex: 'actions',
                                    key: 'actions',
                                    render: (_text, resource) => {
                                        const currentMedication = findCurrentMedication(medications, resource);
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                                                <ModalMedicationRequestConfirm
                                                    medicationRequest={resource}
                                                    medication={currentMedication}
                                                    onCreate={pagerManager.reload}
                                                />
                                                <ModalMedicationRequestCancel
                                                    medicationRequest={resource}
                                                    onCreate={pagerManager.reload}
                                                    medication={currentMedication}
                                                />
                                            </div>
                                        );
                                    },
                                },
                            ]}
                        />
                    );
                }}
            </RenderRemoteData>
        </PageContainer>
    );
}

function findCurrentMedication(medications: Medication[], medicationRequest: MedicationRequest) {
    console.log('medications', medications);
    return medications.find(
        (medication) => medication.id === medicationRequest.medicationReference?.reference?.split('/')?.[1],
    )!;
}

function mapPrescriptionStatus(medicationRequest: MedicationRequest): string {
    const statusMap = {
        active: t`Active`,
        'on-hold': t`On Hold`,
        cancelled: t`Cancelled`,
        completed: t`Completed`,
        'entered-in-error': t`Entered in error`,
        stopped: t`Stopped`,
        draft: t`Draft`,
        unknown: t`Unknown`,
    };

    return statusMap[medicationRequest.status];
}
