import { Trans } from '@lingui/macro';
import { Row, Col, Table } from 'antd';
import { Medication } from 'fhir/r4b';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { SpinIndicator } from 'src/components/Spinner';
import { Title } from 'src/components/Typography';
import { formatHumanDate } from 'src/utils/date';

import { useMedicationList } from './hooks';

export function MedicationManagement() {
    const { medicationResponse, pagination, handleTableChange } = useMedicationList();

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Medications</Trans>
                        </Title>
                    </Col>
                </Row>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
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
            </BasePageContent>
        </>
    );
}

function RenderStrength({ medication }: { medication: Medication }) {
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
