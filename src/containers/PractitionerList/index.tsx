import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { Bundle, HumanName, Practitioner } from 'fhir/r4b';

import { SearchBarColumn, SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceListPage, navigationAction, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { compileAsArray, compileAsFirst } from 'src/utils';
import { renderHumanName } from 'src/utils/fhir';

// FHIRPath helpers
const getPractitionerName = compileAsFirst<Practitioner, HumanName>('Practitioner.name.first()');
const getPractitionerReference = compileAsFirst<Practitioner, string>("'Practitioner/' & id");
const getSpecialtiesByPractitionerRef = compileAsArray<Bundle, string>(
    'Bundle.entry.resource' +
        ".where(resourceType='PractitionerRole' and practitioner.reference=%practitionerRef)" +
        '.specialty.first().coding.first().display',
);

export function PractitionerList() {
    const getFilters = (): SearchBarColumn[] => [
        {
            id: 'practitioner',
            searchParam: 'name',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by name`,
            placement: ['search-bar', 'table'],
        },
    ];

    const getTableColumns = (_manager: TableManager): ColumnsType<RecordType<Practitioner>> => [
        {
            title: <Trans>Name</Trans>,
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (_text, record) => renderHumanName(getPractitionerName(record.resource)),
        },
        {
            title: <Trans>Specialty</Trans>,
            dataIndex: 'specialty',
            key: 'specialty',
            width: '30%',
            render: (_text, record) => {
                const practitionerRef = getPractitionerReference(record.resource);
                const specialties = practitionerRef
                    ? getSpecialtiesByPractitionerRef(record.bundle, { practitionerRef })
                    : [];
                return specialties.filter(Boolean).join(', ');
            },
        },
    ];

    const getRecordActions = (record: RecordType<Practitioner>, _manager: TableManager) => [
        navigationAction(<Trans>Open</Trans>, `/practitioners/${record.resource.id}`),
    ];

    const getHeaderActions = () => [
        questionnaireAction(<Trans>Add new practitioner</Trans>, 'practitioner-create', { icon: <PlusOutlined /> }),
    ];

    return (
        <ResourceListPage<Practitioner>
            headerTitle={t`Practitioners`}
            resourceType="Practitioner"
            searchParams={{
                _sort: '-_lastUpdated,_id',
                _count: 10,
                _revinclude: ['PractitionerRole:practitioner'],
            }}
            getFilters={getFilters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}
