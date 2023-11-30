import { Trans } from '@lingui/macro';
import { Row, Col, Typography, Table } from 'antd';
import { MedicationKnowledge } from 'fhir/r4b';
import { RenderRemoteData } from 'fhir-react';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { formatHumanDate } from 'shared/src/utils/date';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { SpinIndicator } from 'src/components/Spinner';
import { Title } from 'src/components/Typography';

import { useMedicationKnowledge, useMedicationList } from './hooks';
import { ModalNewMedicationBatch } from './ModalNewMedicationBatch';
import { ModalNewMedicationKnowledge } from './ModalNewMedicationKnowledge';
import { MedicationKnowledgeCharacteristics, getMedicationTableData } from './utils';

export function MedicationManagement() {
    const { medicationKnowledgeResponse, pagination, handleTableChange, pagerManager } = useMedicationKnowledge();

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Medications</Trans>
                        </Title>
                    </Col>
                    <Col>
                        <ModalNewMedicationKnowledge onCreate={pagerManager.reload} />
                    </Col>
                </Row>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <Table
                    pagination={pagination}
                    onChange={handleTableChange}
                    dataSource={
                        isSuccess(medicationKnowledgeResponse)
                            ? medicationKnowledgeResponse.data.map((resourceData) => {
                                  return { ...{ key: resourceData.id }, ...resourceData };
                              })
                            : []
                    }
                    expandable={{
                        expandedRowRender: (record) => <OtherDetails medicationKnowledge={record} />,
                    }}
                    columns={[
                        {
                            title: <Trans>Name</Trans>,
                            dataIndex: 'name',
                            key: 'name',
                            render: (_text, resource) => resource.code?.coding?.[0]?.display,
                        },
                        {
                            title: <Trans>Cost</Trans>,
                            dataIndex: 'cost',
                            key: 'cost',
                            render: (_text, resource) =>
                                `${resource.cost?.[0]?.cost.value} ${resource.cost?.[0]?.cost.currency}`,
                        },
                        {
                            title: <Trans>Actions</Trans>,
                            dataIndex: 'actions',
                            key: 'actions',
                            render: (_text, resource) => (
                                <ModalNewMedicationBatch
                                    onCreate={pagerManager.reload}
                                    medicationKnowledge={resource}
                                />
                            ),
                        },
                    ]}
                    loading={isLoading(medicationKnowledgeResponse) && { indicator: SpinIndicator }}
                />
            </BasePageContent>
        </>
    );
}

function OtherDetails({ medicationKnowledge }: { medicationKnowledge: MedicationKnowledge }) {
    const { medicationResponse, handleTableChange } = useMedicationList({
        code: medicationKnowledge.code?.coding?.[0]?.code,
        status: 'active',
    });

    return (
        <RenderRemoteData remoteData={medicationResponse}>
            {(medications) => {
                return (
                    <div
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '12px' }}
                    >
                        <div style={{ flex: 0.8 }}>
                            <MedicationKnowledgeCharacteristics
                                medicationKnowledge={medicationKnowledge}
                                medicationList={medications}
                            />
                        </div>
                        <div style={{ flex: 0.3 }}>
                            <div>
                                <Typography.Title level={5}>Availability</Typography.Title>
                            </div>
                            <Table
                                pagination={false}
                                onChange={handleTableChange}
                                dataSource={getMedicationTableData(medications)}
                                columns={[
                                    {
                                        title: <Trans>Units</Trans>,
                                        dataIndex: 'availableUnits',
                                        key: 'availableUnits',
                                        render: (_text, resource) => resource.availableUnits,
                                    },
                                    {
                                        title: <Trans>Batch</Trans>,
                                        dataIndex: 'batchNumber',
                                        key: 'batchNumber',
                                        render: (_text, resource) => resource.lotNumber,
                                    },
                                    {
                                        title: <Trans>Expiration</Trans>,
                                        dataIndex: 'expirationDate',
                                        key: 'expirationDate',
                                        render: (_text, resource) => formatHumanDate(resource.expiredAt ?? ''),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                );
            }}
        </RenderRemoteData>
    );
}
