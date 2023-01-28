import { t, Trans } from '@lingui/macro';
import Title from 'antd/es/typography/Title';

import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { EncountersTable } from 'src/components/EncountersTable';
import { EncounterData } from 'src/components/EncountersTable/types';
import { EncounterStatusBadge } from 'src/components/EncounterStatusBadge';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { Spinner } from 'src/components/Spinner';

import { useEncounterList } from './hooks';
import { EncounterListFilters, EncounterListFilterValues } from './types';

const columns = [
    {
        title: <Trans>Patient</Trans>,
        dataIndex: 'patient',
        key: 'patient',
        render: (_text: any, resource: EncounterData) =>
            renderHumanName(resource.patient?.name?.[0]),
    },
    {
        title: <Trans>Practitioner</Trans>,
        dataIndex: 'practitioner',
        key: 'practitioner',
        render: (_text: any, resource: EncounterData) =>
            renderHumanName(resource.practitioner?.name?.[0]),
    },
    {
        title: <Trans>Status</Trans>,
        dataIndex: 'status',
        key: 'status',
        render: (_text: any, resource: EncounterData) => (
            <EncounterStatusBadge status={resource.status} />
        ),
    },
    {
        title: <Trans>Appointment date</Trans>,
        dataIndex: 'humanReadableDate',
        key: 'date',
    },
];

export function EncounterList() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: [
            {
                id: 'patient',
                type: 'string',
                placeholder: t`Search by patient`,
            },
            {
                id: 'practitioner',
                type: 'string',
                placeholder: t`Search by practitioner`,
            },
            {
                id: 'date',
                type: 'date',
                placeholder: [t`Start date`, t`End date`],
            },
        ] as EncounterListFilters,
    });

    const { encounterDataListRD } = useEncounterList(
        columnsFilterValues as EncounterListFilterValues,
    );

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Title style={{ marginBottom: 40 }}>
                    <Trans>Encounters</Trans>
                </Title>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                {isLoading(encounterDataListRD) ? <Spinner /> : null}
                {isSuccess(encounterDataListRD) ? (
                    <EncountersTable columns={columns} dataSource={encounterDataListRD.data} />
                ) : null}
            </BasePageContent>
        </>
    );
}
