import { Trans } from '@lingui/macro';
import { Table, Row, Col } from 'antd';
import { RenderRemoteData } from 'fhir-react';

import { isLoading } from 'fhir-react/lib/libs/remoteData';

import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { SpinIndicator } from 'src/components/Spinner';
import { Title } from 'src/components/Typography';

import { useMedicationRequest } from './hooks';
import { ModalMedicationRequestCancel } from './ModalMedicationRequestCancel';
import { ModalMedicationRequestConfirm } from './ModalMedicationRequestConfirm';

export function Prescriptions() {
    const { pagination, medicationRequestResponse, pagerManager, handleTableChange } = useMedicationRequest({
        _include: [
            'MedicationRequest:subject:Patient',
            'MedicationRequest:requester',
            'MedicationRequest:medication:Medication',
        ],
    });

    return (
        <>
            <RenderRemoteData remoteData={medicationRequestResponse}>
                {(data) => {
                    const patients = data.patient;
                    const organizations = data.organization;
                    const practitioners = data.practitioner;
                    const medications = data.medication;

                    return (
                        <>
                            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                                <Row
                                    justify="space-between"
                                    align="middle"
                                    style={{ marginBottom: 40 }}
                                    gutter={[16, 16]}
                                >
                                    <Col>
                                        <Title style={{ marginBottom: 0 }}>
                                            <Trans>Prescriptions</Trans>
                                        </Title>
                                    </Col>
                                </Row>
                            </BasePageHeader>
                            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                                <Table
                                    pagination={pagination}
                                    onChange={handleTableChange}
                                    dataSource={data.medicationRequest.map((resourceData) => {
                                        return { ...{ key: resourceData.id }, ...resourceData };
                                    })}
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
                                    loading={isLoading(medicationRequestResponse) && { indicator: SpinIndicator }}
                                />
                            </BasePageContent>
                        </>
                    );
                }}
            </RenderRemoteData>
        </>
    );
}
