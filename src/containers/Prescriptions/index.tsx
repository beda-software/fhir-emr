import { Trans } from '@lingui/macro';
import { Table } from 'antd';
import { RenderRemoteData } from 'fhir-react';

import { renderHumanName } from 'shared/src/utils/fhir';

import { PageContainer } from 'src/components/PageContainer';
import { Spinner } from 'src/components/Spinner';
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
            title="Prescriptions"
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
            content={
                <RenderRemoteData remoteData={medicationRequestResponse} renderLoading={Spinner}>
                    {({ patients, organizations, practitioners, medications, medicationRequests }) => {
                        return (
                            <Table
                                pagination={pagination}
                                onChange={handleTableChange}
                                dataSource={medicationRequests}
                                columns={[
                                    {
                                        title: <Trans>Patient</Trans>,
                                        dataIndex: 'name',
                                        key: 'name',
                                        render: (_text, resource) =>
                                            renderHumanName(
                                                patients.find(
                                                    (patient) =>
                                                        patient.id === resource.subject.reference?.split('/')?.[1],
                                                )?.name?.[0],
                                            ),
                                    },
                                    {
                                        title: <Trans>Requester</Trans>,
                                        dataIndex: 'requester',
                                        key: 'requester',
                                        render: (_text, resource) => {
                                            const requesterId = resource.requester?.reference?.split('/')?.[1];
                                            const requesterResourceType =
                                                resource.requester?.reference?.split('/')?.[0];
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
                                        render: (_text, resource) =>
                                            medications.find(
                                                (medication) =>
                                                    medication.id ===
                                                    resource.medicationReference?.reference?.split('/')?.[1],
                                            )?.code?.coding?.[0]?.display,
                                    },
                                    {
                                        title: <Trans>Batch Number</Trans>,
                                        dataIndex: 'batchNumber',
                                        key: 'batchNumber',
                                        render: (_text, resource) =>
                                            medications.find(
                                                (medication) =>
                                                    medication.id ===
                                                    resource.medicationReference?.reference?.split('/')?.[1],
                                            )?.batch?.lotNumber,
                                    },
                                    {
                                        title: <Trans>Status</Trans>,
                                        dataIndex: 'status',
                                        key: 'status',
                                        render: (_text, resource) => resource.status,
                                    },
                                    {
                                        title: <Trans>Actions</Trans>,
                                        dataIndex: 'actions',
                                        key: 'actions',
                                        render: (_text, resource) => {
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                                                    <ModalMedicationRequestConfirm
                                                        medicationRequest={resource}
                                                        onCreate={pagerManager.reload}
                                                    />
                                                    <ModalMedicationRequestCancel
                                                        medicationRequest={resource}
                                                        onCreate={pagerManager.reload}
                                                        medication={
                                                            medications.find(
                                                                (medication) =>
                                                                    medication.id ===
                                                                    resource.medicationReference?.reference?.split(
                                                                        '/',
                                                                    )?.[1],
                                                            )!
                                                        }
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
            }
        />
    );
}
