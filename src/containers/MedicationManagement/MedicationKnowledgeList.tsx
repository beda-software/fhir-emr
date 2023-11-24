import { Trans } from '@lingui/macro';
import { Table } from 'antd';
import { Medication, MedicationKnowledge } from 'fhir/r4b';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { SpinIndicator } from 'src/components/Spinner';

import { useMedicationKnowledge } from './hooks';
import { RenderStrength } from './MedicationList';

export function MedicationKnowledgeList() {
    const { medicationKnowledgeResponse, pagination, handleTableChange } = useMedicationKnowledge();

    return (
        <>
            <Table
                pagination={pagination}
                onChange={handleTableChange}
                dataSource={isSuccess(medicationKnowledgeResponse) ? medicationKnowledgeResponse.data : []}
                expandable={{
                    expandedRowRender: (record) => <OtherDetails medicationKnowledge={record} />,
                }}
                columns={[
                    {
                        title: <Trans>Name</Trans>,
                        dataIndex: 'name',
                        key: 'name',
                        render: (_text, resource) => <RenderMedicationKnowledgeName medicationKnowledge={resource} />,
                    },
                    {
                        title: <Trans>Cost</Trans>,
                        dataIndex: 'cost',
                        key: 'cost',
                        render: (_text, resource) =>
                            `${resource.cost?.[0]?.cost.value} ${resource.cost?.[0]?.cost.currency}`,
                    },
                ]}
                loading={isLoading(medicationKnowledgeResponse) && { indicator: SpinIndicator }}
            />
        </>
    );
}

function RenderMedicationKnowledgeName({ medicationKnowledge }: { medicationKnowledge: MedicationKnowledge }): string {
    const medicationForm = medicationKnowledge.doseForm?.coding?.[0]?.display;
    const medicationDisplay = medicationKnowledge.code?.coding?.[0]?.display;
    const packageName = medicationKnowledge.packaging?.type?.coding?.[0]?.display;
    const amount = `${medicationKnowledge.amount?.value} ${medicationKnowledge.amount?.unit}`;
    const synonym = medicationKnowledge.synonym?.join(', ');

    return `${medicationForm} ${medicationDisplay} (${packageName}, ${amount}), ${synonym}`;
}

function OtherDetails({ medicationKnowledge }: { medicationKnowledge: MedicationKnowledge }) {
    return (
        <ul>
            <li>Synonym: {medicationKnowledge.synonym?.join(', ')}</li>
            <li>Strength: {<RenderStrength medication={medicationKnowledge} />}</li>
        </ul>
    );
}
