import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { useEncounterList } from 'src/containers/EncounterList/hooks';
import { EncounterData } from 'src/containers/EncounterList/types';
import { PatientHeaderContext } from 'src/containers/PatientDetails/PatientHeader/context';

import { EncounterStatusBadge } from '../EncounterStatusBadge';
import { ModalNewEncounter } from '../ModalNewEncounter';
import { Table } from '../Table';
import s from './PatientEncounter.module.scss';

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
        width: '70%',
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
        title: <Trans>Appointment date</Trans>,
        dataIndex: 'date',
        key: 'date',
        render: (_text: any, resource: EncounterData) => moment(resource.date).format('YYYY/MM/DD'),
    },
];

export const PatientEncounter = ({ patient }: Props) => {
    const navigate = useNavigate();
    const { encounterDataListRD, reloadEncounter } = useEncounterList({ subject: patient.id });

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
            <RenderRemoteData remoteData={encounterDataListRD}>
                {(tableData) => (
                    <Table
                        rowKey={(record) => record.id}
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
                        dataSource={tableData}
                        columns={columns}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    navigate(`/patients/${patient.id}/encounters/${record.id}`);
                                },
                            };
                        }}
                        rowClassName={s.row}
                    />
                )}
            </RenderRemoteData>
        </>
    );
};
