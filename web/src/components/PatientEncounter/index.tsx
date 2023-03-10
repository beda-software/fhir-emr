import { Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { useEncounterList } from 'src/containers/EncounterList/hooks';
import { PatientHeaderContext } from 'src/containers/PatientDetails/PatientHeader/context';
import { formatPeriodDateTime } from 'src/utils/date';

import { EncountersTable } from '../EncountersTable';
import { EncounterData } from '../EncountersTable/types';
import { EncounterStatusBadge } from '../EncounterStatusBadge';
import { ModalNewEncounter } from '../ModalNewEncounter';

interface Props {
    patient: Patient;
}

const columns: ColumnsType<EncounterData> = [
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
        render: (_text: any, resource: EncounterData) => {
            return <EncounterStatusBadge status={resource.status} />;
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
            <div>
                <Link
                    to={`/patients/${resource.patient?.id}/encounters/${resource.id}`}
                    style={{ marginRight: 10 }}
                >
                    Open
                </Link>
                <Link to={`/encounters/${resource.id}/video`} state={{ encounterData: resource }}>
                    Video call
                </Link>
            </div>
        ),
    },
];

export const PatientEncounter = ({ patient }: Props) => {
    const { encounterDataListRD, reloadEncounter, handleTableChange, pagination } =
        useEncounterList(undefined, {
            subject: patient.id,
        });

    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const location = useLocation();

    useEffect(() => {
        setBreadcrumbs({ [location?.pathname]: 'Encounters' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>
                <ModalNewEncounter patient={patient} reloadEncounter={reloadEncounter} />
            </div>
            <EncountersTable
                columns={columns}
                remoteData={encounterDataListRD}
                handleTableChange={handleTableChange}
                pagination={pagination}
            />
        </>
    );
};
