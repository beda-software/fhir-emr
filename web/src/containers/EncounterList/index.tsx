import { t, Trans } from '@lingui/macro';
import { Empty } from 'antd';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout, BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { Table } from 'src/components/Table';

import { useEncounterList } from './hooks';
import { EncounterData } from './types';

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
    },
    {
        title: <Trans>Appointment date</Trans>,
        dataIndex: 'humanReadableDate',
        key: 'date',
    },
];

export function EncounterList() {
    const navigate = useNavigate();

    const { encounterDataListRD } = useEncounterList({});

    const { columnsFilterValues, filteredData, onChangeColumnFilter, onResetFilters } =
        useSearchBar<EncounterData>({
            columns: [
                {
                    id: 'encounterPatient',
                    type: 'string',
                    key: 'patient',
                    placeholder: t`Search by patient`,
                },
                {
                    id: 'encounterPractitioner',
                    type: 'string',
                    key: 'practitioner',
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
        <BaseLayout>
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
                <Table<EncounterData>
                    locale={{
                        emptyText: (
                            <>
                                <Empty
                                    description={<Trans>No data</Trans>}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </>
                        ),
                    }}
                    dataSource={filteredData}
                    columns={columns}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                navigate(`/patients/${record.patient?.id}/encounters/${record.id}`);
                            },
                        };
                    }}
                />
            </BasePageContent>
        </BaseLayout>
    );
}
