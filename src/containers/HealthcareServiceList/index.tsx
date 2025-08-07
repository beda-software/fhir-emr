import { t, Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { HealthcareService } from 'fhir/r4b';

import { SearchBarColumn, SearchBarColumnType, SorterColumn } from 'src/components/SearchBar/types';
import { ResourceListPage, questionnaireAction } from 'src/uberComponents/ResourceListPage';
import { RecordType, TableManager } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';
import { selectCurrentUserRoleResource } from 'src/utils/role';

// FHIRPath compiled expressions
const getName = compileAsFirst<HealthcareService, string>('HealthcareService.name');
const getDuration = compileAsFirst<HealthcareService, number>(
    "HealthcareService.extension('urn:extensions:healthcare-service-duration').valueInteger",
);
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

    const getTableColumns = (manager: TableManager): ColumnsType<RecordType<HealthcareService>> => [
        {
            title: <Trans>Type</Trans>,
            dataIndex: 'type',
            key: 'type',
            width: '20%',
            render: (_text, record) => getName(record.resource),
        },
        {
            title: <Trans>Duration (minutes)</Trans>,
            dataIndex: 'duration',
            key: 'duration',
            width: '20%',
            render: (_text, record) => getDuration(record.resource),
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'active',
            key: 'active',
            width: '20%',
            render: (_text, record) => (getActive(record.resource) ? t`Active` : t`Inactive`),
        },
    ];

    const getRecordActions = (record: RecordType<HealthcareService>, manager: TableManager) => {
        return [
            questionnaireAction(<Trans>Edit</Trans>, 'healthcare-service-edit', {
                extra: {
                    qrfProps: {
                        launchContextParameters: [{ name: 'HealthcareService', resource: record.resource }],
                        onSuccess: manager.reload,
                    },
                },
            }),
            questionnaireAction(
                getActive(record.resource) ? t`Deactivate` : t`Activate`,
                'healthcare-service-change-activity',
                {
                    extra: {
                        qrfProps: {
                            launchContextParameters: [{ name: 'HealthcareService', resource: record.resource }],
                            onSuccess: manager.reload,
                        },
                    },
                },
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
