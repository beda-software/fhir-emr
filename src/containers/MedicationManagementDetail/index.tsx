import { t } from '@lingui/macro';
import { Bundle, Medication, MedicationKnowledge, ParametersParameter } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';

import { Text } from 'src/components/Typography';
import { ResourceDetailPage, Tab } from 'src/uberComponents/ResourceDetailPage';
import { questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, ReportColumn } from 'src/uberComponents/ResourceListPage/types';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';
import { compileAsArray, compileAsFirst } from 'src/utils';

// FHIRPath helpers
const getMedicationName = compileAsFirst<MedicationKnowledge, string>(
    'MedicationKnowledge.code.coding.first().display',
);
const getMedicationCode = compileAsFirst<MedicationKnowledge, string>('MedicationKnowledge.code.coding.first().code');
const getPackagingDisplay = compileAsFirst<MedicationKnowledge, string>(
    'MedicationKnowledge.packaging.type.coding.first().display',
);
const getAmountValue = compileAsFirst<MedicationKnowledge, number>('MedicationKnowledge.amount.value');
const getAmountUnit = compileAsFirst<MedicationKnowledge, string>('MedicationKnowledge.amount.unit');
const getDoseFormDisplay = compileAsFirst<MedicationKnowledge, string>(
    'MedicationKnowledge.doseForm.coding.first().display',
);
const getCostValue = compileAsFirst<MedicationKnowledge, number>('MedicationKnowledge.cost.first().cost.value');
const getCostCurrency = compileAsFirst<MedicationKnowledge, string>('MedicationKnowledge.cost.first().cost.currency');
const getIngridientsLines = compileAsArray<MedicationKnowledge, string>(`
    MedicationKnowledge.ingredient.where(isActive = true).select(
      (itemCodeableConcept.coding.first().display | itemCodeableConcept.text) & ' | ' &
      (strength.numerator.value.toString() & ' ' & strength.numerator.unit.toString()) & ' / ' &
      (strength.denominator.value.toString() & ' ' & strength.denominator.unit.toString())
    )
`);

// Medication table helpers
const getMedicationLotNumber = compileAsFirst<Medication, string>('Medication.batch.lotNumber');
const getMedicationExpirationDate = compileAsFirst<Medication, string>('Medication.batch.expirationDate');

function MedicationKnowledgeOverview({ resource }: { resource: MedicationKnowledge }) {
    const code = getMedicationCode(resource);

    const getReportColumns = (bundle: Bundle): Array<ReportColumn> => {
        const { Medication: medications = [] } = extractBundleResources(bundle);
        const availableUnits = medications.length;

        const calculateIngridients = () => {
            const lines = getIngridientsLines(resource) ?? [];
            if (!lines.length) return '';
            return (
                <div>
                    {lines.map((line) => (
                        <Text key={line}>{line}</Text>
                    ))}
                </div>
            );
        };

        return [
            { title: t`Ingridients`, value: calculateIngridients() },

            { title: t`Packaging`, value: getPackagingDisplay(resource) ?? '' },
            {
                title: t`Amount`,
                value: `${getAmountValue(resource) ?? ''} ${getAmountUnit(resource) ?? ''}`.trim(),
            },
            { title: t`Dose form`, value: getDoseFormDisplay(resource) ?? '' },
            {
                title: t`Cost`,
                value: `${getCostValue(resource) ?? ''} ${getCostCurrency(resource) ?? ''}`.trim(),
            },
            { title: t`Available units`, value: availableUnits },
        ];
    };

    return (
        <ResourceListPageContent<Medication>
            resourceType="Medication"
            searchParams={{ code }}
            getHeaderActions={() => [questionnaireAction(t`Add batch`, 'medication-batch-create')]}
            defaultLaunchContext={[{ name: 'CurrentMedicationKnowledge', resource } as ParametersParameter]}
            getTableColumns={() => [
                {
                    title: t`Lot number`,
                    key: 'lotNumber',
                    render: (_: unknown, record) => getMedicationLotNumber(record.resource) ?? '',
                },
                {
                    title: t`Expiration date`,
                    key: 'expirationDate',
                    render: (_: unknown, record) => getMedicationExpirationDate(record.resource) ?? '',
                },
            ]}
            getReportColumns={getReportColumns}
        />
    );
}

export function MedicationManagementDetail() {
    const tabs: Array<Tab<MedicationKnowledge>> = [
        {
            path: '',
            label: t`Overview`,
            component: (context: RecordType<MedicationKnowledge>) => (
                <MedicationKnowledgeOverview resource={context.resource} />
            ),
        },
    ];

    return (
        <ResourceDetailPage<MedicationKnowledge>
            resourceType="MedicationKnowledge"
            getSearchParams={({ id }) => ({ _id: id })}
            getTitle={({ resource, bundle }) => getMedicationName(resource, { bundle }) ?? ''}
            tabs={tabs}
        />
    );
}
