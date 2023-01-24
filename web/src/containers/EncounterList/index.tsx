import { t, Trans } from '@lingui/macro';
import Title from 'antd/es/typography/Title';

import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { EncounterData, EncountersTable } from 'src/components/EncountersTable';
import { EncounterStatusBadge } from 'src/components/EncounterStatusBadge';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { Spinner } from 'src/components/Spinner';

import { useEncounterList } from './hooks';

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
    const { encounterDataListRD } = useEncounterList({});

    const { columnsFilterValues, filteredData, onChangeColumnFilter, onResetFilters } =
        useSearchBar<EncounterData>({
            columns: [
                {
                    id: 'encounterPatient',
                    type: 'string',
                    key: (resource) => renderHumanName(resource.patient?.name?.[0]),
                    placeholder: t`Search by patient`,
                },
                {
                    id: 'encounterPractitioner',
                    type: 'string',
                    key: (resource) => renderHumanName(resource.practitioner?.name?.[0]),
                    placeholder: t`Search by practitioner`,
                },
                {
                    id: 'encounterDate',
                    type: 'date',
                    key: 'date',
                    placeholder: [t`Start date`, t`End date`],
                },
            ],
            data: isSuccess(encounterDataListRD) ? encounterDataListRD.data : [],
        });

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Title style={{ marginBottom: 40 }}>
                    <Trans>Encounters</Trans>
                </Title>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    filteredData={filteredData}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                {isLoading(encounterDataListRD) ? <Spinner /> : null}
                {isSuccess(encounterDataListRD) ? (
                    <EncountersTable columns={columns} dataSource={filteredData} />
                ) : null}
            </BasePageContent>
        </>
    );
}
