import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import type { ColumnsType } from 'antd/es/table/interface';
import { MedicationKnowledge } from 'fhir/r4b';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { navigationAction } from 'src/uberComponents/ResourceListPage/actions';
import type { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';

// FHIRPath helpers
const getMedicationName = compileAsFirst<MedicationKnowledge, string>(
    'MedicationKnowledge.code.coding.first().display',
);
const getCostValue = compileAsFirst<MedicationKnowledge, number>('MedicationKnowledge.cost.first().cost.value');
const getCostCurrency = compileAsFirst<MedicationKnowledge, string>('MedicationKnowledge.cost.first().cost.currency');

export function MedicationManagement() {
    const getFilters = (): SearchBarColumn[] => [
        {
            id: 'code',
            searchParam: 'code',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by code`,
            placement: ['search-bar', 'table'],
        },
    ];

    const getTableColumns = (): ColumnsType<RecordType<MedicationKnowledge>> => [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            render: (_text, record) => getMedicationName(record.resource),
        },
        {
            title: <Trans>Cost</Trans>,
            dataIndex: 'cost',
            key: 'cost',
            render: (_text, record) => {
                const value = getCostValue(record.resource);
                const currency = getCostCurrency(record.resource);
                return value && currency ? `${value} ${currency}` : '';
            },
        },
    ];

    const getRecordActions = (record: RecordType<MedicationKnowledge>, _manager: TableManager) => [
        navigationAction(<Trans>Open</Trans>, `/medications/${record.resource.id}`),
        questionnaireAction(<Trans>Batch</Trans>, 'medication-batch-create', {
            extra: {
                qrfProps: {
                    launchContextParameters: [
                        {
                            name: 'CurrentMedicationKnowledge',
                            resource: record.resource,
                        },
                    ],
                },
            },
        }),
    ];

    const getHeaderActions = () => [
        questionnaireAction(<Trans>Add Medication</Trans>, 'medication-knowledge-create', { icon: <PlusOutlined /> }),
    ];

    return (
        <ResourceListPage<MedicationKnowledge>
            headerTitle={t`Medications`}
            resourceType="MedicationKnowledge"
            searchParams={{
                _sort: '-_lastUpdated,_id',
                _count: 10,
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}
