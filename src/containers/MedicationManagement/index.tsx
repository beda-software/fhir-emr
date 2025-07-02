import { t, Trans } from '@lingui/macro';
import { Typography } from 'antd';
import { MedicationKnowledge } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { isLoading, isSuccess } from '@beda.software/remote-data';

import { Table } from 'src/components';
import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { SpinIndicator } from 'src/components/Spinner';
import { formatHumanDate } from 'src/utils/date';

import { MedicationsSearchBar } from './components/MedicationsSearchBar';
import { useMedicationsSearchBarSelect } from './components/MedicationsSearchBar/hooks';
import { useMedicationKnowledge, useMedicationList } from './hooks';
import { ModalNewMedicationBatch } from './ModalNewMedicationBatch';
import { ModalNewMedicationKnowledge } from './ModalNewMedicationKnowledge';
import { MedicationKnowledgeCharacteristics, getMedicationTableData } from './utils';
import { getSelectedValue } from '../OrganizationScheduling/utils';

export function MedicationManagement() {
    const { selectedMedication, medicationOptions, onChange, resetFilter } = useMedicationsSearchBarSelect();
    const { medicationKnowledgeResponse, pagination, handleTableChange, pagerManager } = useMedicationKnowledge(
        getSelectedValue(selectedMedication),
    );

    return (
        <PageContainer
            title={t`Medications`}
            layoutVariant="with-table"
            titleRightElement={<ModalNewMedicationKnowledge onCreate={pagerManager.reload} />}
            headerContent={
                <MedicationsSearchBar
                    selectedMedication={selectedMedication}
                    loadMedicationOptions={medicationOptions}
                    onChangeMedication={(selectedOption) => onChange(selectedOption, 'medication')}
                    reset={resetFilter}
                />
            }
        >
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
        </PageContainer>
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
