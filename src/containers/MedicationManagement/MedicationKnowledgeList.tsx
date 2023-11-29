import { Trans } from '@lingui/macro';
import { Table, Typography } from 'antd';
import { MedicationKnowledge } from 'fhir/r4b';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { SpinIndicator } from 'src/components/Spinner';
import { formatHumanDate } from 'src/utils/date';

import { useMedicationKnowledge, useMedicationList } from './hooks';
import { ModalNewMedicationBatch } from './ModalNewMedicationBatch';
import { ModalNewMedicationKnowledge } from './ModalNewMedicationKnowledge';
import { getMedicationTableData, MedicationKnowledgeCharacteristics } from './utils';

export function MedicationKnowledgeList() {
    const { medicationKnowledgeResponse, pagination, handleTableChange, pagerManager } = useMedicationKnowledge();

    return (
        <>
            <ModalNewMedicationKnowledge onCreate={pagerManager.reload} />
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
                            <ModalNewMedicationBatch onCreate={pagerManager.reload} medicationKnowledge={resource} />
                        ),
                    },
                ]}
                loading={isLoading(medicationKnowledgeResponse) && { indicator: SpinIndicator }}
            />
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
            {(data) => {
                return (
                    <div
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '12px' }}
                    >
                        <div style={{ flex: 0.8 }}>
                            <MedicationKnowledgeCharacteristics medicationKnowledge={medicationKnowledge} />
                        </div>
                        <div style={{ flex: 0.3 }}>
                            <div>
                                <Typography.Title level={5}>Availability</Typography.Title>
                            </div>
                            <Table
                                pagination={false}
                                onChange={handleTableChange}
                                dataSource={getMedicationTableData(data)}
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
