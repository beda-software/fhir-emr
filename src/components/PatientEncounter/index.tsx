import { Trans } from '@lingui/macro';
import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Patient } from 'fhir/r4b';
import { Link } from 'react-router-dom';

import { SearchParams } from '@beda.software/fhir-react';

import { EncountersTable } from 'src/components/EncountersTable';
import { EncounterData } from 'src/components/EncountersTable/types';
import { StatusBadge } from 'src/components/EncounterStatusBadge';
import { ModalNewEncounter } from 'src/components/ModalNewEncounter';
import { useEncounterList } from 'src/containers/EncounterList/hooks';
import { formatPeriodDateTime } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';

interface Props {
    patient: Patient;
    searchParams?: SearchParams;
    hideCreateButton?: boolean;
}

const columns: ColumnsType<EncounterData> = [
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
        render: (_text: any, resource: EncounterData) => {
            return <StatusBadge status={resource.status} />;
        },
    },
    {
        title: <Trans>Date</Trans>,
        dataIndex: 'date',
        key: 'date',
        width: 250,
        render: (_text: any, resource: EncounterData) => formatPeriodDateTime(resource.period),
    },
    {
        title: <Trans>Actions</Trans>,
        dataIndex: 'actions',
        key: 'action',
        width: 200,
        render: (_text: any, resource: EncounterData) => (
            <Row>
                <Col>
                    <Link
                        to={`/patients/${resource.patient?.id}/encounters/${resource.id}`}
                        style={{ marginRight: 10 }}
                    >
                        <Trans>Open</Trans>
                    </Link>
                </Col>
                <Col>
                    <Link to={`/encounters/${resource.id}/video`} state={{ encounterData: resource }}>
                        <Trans>Video call</Trans>
                    </Link>
                </Col>
            </Row>
        ),
    },
];

export const PatientEncounter = ({ patient, searchParams, hideCreateButton }: Props) => {
    const { encounterDataListRD, reloadEncounter, handleTableChange, pagination } = useEncounterList(undefined, {
        ...{
            subject: patient.id,
        },
        ...searchParams,
    });

    return (
        <>
            {hideCreateButton ? null : (
                <div>
                    <ModalNewEncounter patient={patient} reloadEncounter={reloadEncounter} />
                </div>
            )}
            <EncountersTable
                columns={columns}
                remoteData={encounterDataListRD}
                handleTableChange={handleTableChange}
                pagination={pagination}
            />
        </>
    );
};
