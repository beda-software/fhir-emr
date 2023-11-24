import { Trans } from '@lingui/macro';
import { Table } from 'antd';
import { Medication, MedicationKnowledge } from 'fhir/r4b';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { SpinIndicator } from 'src/components/Spinner';
import { formatHumanDate } from 'src/utils/date';

import { useMedicationList } from './hooks';

export function MedicationList() {
    const { medicationResponse, pagination, handleTableChange } = useMedicationList();

    return (
        <>
            <Table
                pagination={pagination}
                onChange={handleTableChange}
                dataSource={isSuccess(medicationResponse) ? medicationResponse.data : []}
                columns={[
                    {
                        title: <Trans>Name</Trans>,
                        dataIndex: 'name',
                        key: 'name',
                        render: (_text, resource) => resource.code?.coding?.[0]?.display,
                    },
                    {
                        title: <Trans>Form</Trans>,
                        dataIndex: 'form',
                        key: 'form',
                        render: (_text, resource) => resource.form?.coding?.[0]?.display,
                    },
                    {
                        title: <Trans>Strength</Trans>,
                        dataIndex: 'strength',
                        key: 'strength',
                        render: (_text, resource) => <RenderStrength medication={resource} />,
                    },
                    {
                        title: <Trans>Amount</Trans>,
                        dataIndex: 'amount',
                        key: 'amount',
                        render: (_text, resource) => <RenderAmount medication={resource} />,
                    },
                    {
                        title: <Trans>Batch number</Trans>,
                        dataIndex: 'batchNumber',
                        key: 'batchNumber',
                        render: (_text, resource) => resource.batch?.lotNumber,
                    },
                    {
                        title: <Trans>Expiration date</Trans>,
                        dataIndex: 'expirationDate',
                        key: 'expirationDate',
                        render: (_text, resource) => formatHumanDate(resource.batch?.expirationDate ?? ''),
                    },
                ]}
                loading={isLoading(medicationResponse) && { indicator: SpinIndicator }}
            />
        </>
    );
}

export function RenderStrength({ medication }: { medication: Medication | MedicationKnowledge }) {
    const activeIngredients = medication.ingredient?.filter((ingredient) => ingredient.isActive === true);
    const ingredientData = activeIngredients?.map((ingredient) => {
        return {
            name: ingredient.itemCodeableConcept?.coding?.[0]?.display,
            numerator: `${ingredient?.strength?.numerator?.value} ${ingredient?.strength?.numerator?.unit}`,
            denominator: `${ingredient?.strength?.denominator?.value} ${ingredient?.strength?.denominator?.unit}`,
        };
    });

    return (
        <div>
            {ingredientData?.map((ingredient) => {
                const result = `${ingredient.name} | ${ingredient.numerator} / ${ingredient.denominator}`;
                return <div key={result}>{result}</div>;
            })}
        </div>
    );
}

function RenderAmount({ medication }: { medication: Medication }) {
    const numerator = `${medication.amount?.numerator?.value} ${medication.amount?.numerator?.unit}`;
    const denominator = `${medication.amount?.denominator?.value} ${medication.amount?.denominator?.unit}`;

    return `${numerator} / ${denominator}`;
}
