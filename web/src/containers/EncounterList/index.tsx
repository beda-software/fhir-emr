import { t, Trans } from '@lingui/macro';
import { Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';

import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { EncountersTable } from 'src/components/EncountersTable';
import { EncounterData } from 'src/components/EncountersTable/types';
import { StatusBadge } from 'src/components/EncounterStatusBadge';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { formatPeriodDateTime } from 'src/utils/date';

import { useEncounterList } from './hooks';
import { EncounterListFilters, EncounterListFilterValues } from './types';

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

    const { encounterDataListRD, handleTableChange, pagination } = useEncounterList(
        columnsFilterValues as EncounterListFilterValues,
    );

    const columns = [
        {
            title: <Trans>Patient</Trans>,
            dataIndex: 'patient',
            key: 'patient',
            render: (_text: any, resource: EncounterData) => renderHumanName(resource.patient?.name?.[0]),
        },
        {
            title: <Trans>Practitioner</Trans>,
            dataIndex: 'practitioner',
            key: 'practitioner',
            render: (_text: any, resource: EncounterData) => renderHumanName(resource.practitioner?.name?.[0]),
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'status',
            key: 'status',
            render: (_text: any, resource: EncounterData) => <StatusBadge status={resource.status} />,
        },
        {
            title: <Trans>Date</Trans>,
            dataIndex: 'date',
            key: 'date',
            width: 220,
            render: (_text: any, resource: EncounterData) => formatPeriodDateTime(resource.period),
        },
        {
            title: <Trans>Actions</Trans>,
            dataIndex: 'actions',
            key: 'action',
            width: 180,
            render: (_text: any, resource: EncounterData) => (
                <Row wrap={false}>
                    <Col>
                        <Link
                            to={`/patients/${resource.patient?.id}/encounters/${resource.id}`}
                            style={{ marginRight: 10 }}
                        >
                            <Trans>Open</Trans>
                        </Link>
                    </Col>
                    <Col>
                        <Link
                            to={`/encounters/${resource.id}/video`}
                            state={{ encounterData: resource }}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            <Trans>Video call</Trans>
                        </Link>
                    </Col>
                </Row>
            ),
        },
    ];

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
                <EncountersTable
                    columns={columns}
                    remoteData={encounterDataListRD}
                    handleTableChange={handleTableChange}
                    pagination={pagination}
                />
            </BasePageContent>
        </>
    );
}
