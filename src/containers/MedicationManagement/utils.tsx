import { t } from '@lingui/macro';
import { Descriptions } from 'antd';
import { Medication, MedicationKnowledge } from 'fhir/r4b';
import _ from 'lodash';

export function getMedicationTableData(medicationList: Medication[]) {
    const uniqData = _.uniq(
        medicationList.map((medication) => `${medication.batch?.lotNumber} //// ${medication.batch?.expirationDate}`),
    );

    return uniqData.map((uD) => {
        const lotNumber = uD.split(' //// ')?.[0];
        const expiredAt = uD.split(' //// ')?.[1];

        return {
            lotNumber: lotNumber,
            expiredAt: expiredAt,
            availableUnits: medicationList.filter(
                (medication) =>
                    medication.batch?.lotNumber === lotNumber && medication.batch?.expirationDate === expiredAt,
            ).length,
        };
    });
}

export function MedicationKnowledgeCharacteristics({
    medicationKnowledge,
    medicationList,
}: {
    medicationKnowledge: MedicationKnowledge;
    medicationList: Medication[];
}) {
    const descriptionItemData = [
        { label: t`Strength`, children: <RenderStrength medication={medicationKnowledge} /> },
        { label: t`Packaging`, children: medicationKnowledge.packaging?.type?.coding?.[0]?.display },
        { label: t`Amount`, children: `${medicationKnowledge.amount?.value} ${medicationKnowledge.amount?.unit}` },
        { label: t`Dose form`, children: medicationKnowledge.doseForm?.coding?.[0]?.display },
        {
            label: t`Cost`,
            children: `${medicationKnowledge.cost?.[0]?.cost.value} ${medicationKnowledge.cost?.[0]?.cost.currency}`,
        },
        {
            label: t`Available units`,
            children: medicationList.length,
        },
    ];

    return (
        <Descriptions title={t`Characteristics`} bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            {descriptionItemData.map((descriptionItem) => (
                <Descriptions.Item label={descriptionItem.label} key={descriptionItem.label}>
                    {descriptionItem.children}
                </Descriptions.Item>
            ))}
        </Descriptions>
    );
}

function RenderStrength({ medication }: { medication: Medication | MedicationKnowledge }) {
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
