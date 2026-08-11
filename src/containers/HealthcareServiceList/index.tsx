import { t, Trans } from '@lingui/macro';
import { HealthcareService } from 'fhir/r4b';

import { SearchBarColumn, SearchBarColumnType, SorterColumn } from 'src/components/SearchBar/types';
import { ResourceListPage, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { FhirPathTableColumn, RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';
import { selectCurrentUserRoleResource } from 'src/utils/role';

// FHIRPath helpers
const getActive = compileAsFirst<HealthcareService, boolean>('HealthcareService.active');

export function HealthcareServiceList() {
    const getFilters = (): SearchBarColumn[] => [
        {
            id: 'name',
            type: SearchBarColumnType.STRING,
            placeholder: t`Search by name`,
        },
    ];

    const getSorters = (): SorterColumn[] => [
        {
            id: 'type',
            searchParam: 'name',
            label: t`Name`,
        },
        {
            id: 'active',
            searchParam: 'active',
            label: t`Status`,
        },
    ];

    const getTableColumns = (_manager: TableManager): FhirPathTableColumn<HealthcareService>[] => [
        {
            title: <Trans>Type</Trans>,
            dataIndex: 'type',
            key: 'type',
            width: '20%',
            getter: 'HealthcareService.name',
        },
        {
            title: <Trans>Duration (minutes)</Trans>,
            dataIndex: 'duration',
            key: 'duration',
            width: '20%',
            getter: "HealthcareService.extension('urn:extensions:healthcare-service-duration').valueInteger",
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'active',
            key: 'active',
            width: '20%',
            getter: 'HealthcareService.active',
            format: (value) => (value ? t`Active` : t`Inactive`),
        },
    ];

    const getRecordActions = (record: RecordType<HealthcareService>, manager: TableManager) => {
        return [
            questionnaireAction(<Trans>Edit</Trans>, 'healthcare-service-edit'),
            questionnaireAction(
                getActive(record.resource) ? t`Deactivate` : t`Activate`,
                'healthcare-service-change-activity',
            ),
        ];
    };

    const getHeaderActions = () => {
        const author = selectCurrentUserRoleResource();

        return [
            questionnaireAction(<Trans>Add healthcare service</Trans>, 'healthcare-service-create', {
                extra: {
                    qrfProps: {
                        launchContextParameters: [{ name: 'Author', resource: author }],
                    },
                },
            }),
        ];
    };

    return (
        <ResourceListPage
            headerTitle={t`Healthcare Services`}
            resourceType="HealthcareService"
            searchParams={{
                _sort: '-_lastUpdated,_id',
                _count: 10,
            }}
            getFilters={getFilters}
            getSorters={getSorters}
            getTableColumns={getTableColumns}
            getRecordActions={getRecordActions}
            getHeaderActions={getHeaderActions}
        />
    );
}
