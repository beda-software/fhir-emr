import { Trans } from '@lingui/macro';
import { Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Patient } from 'shared/src/contrib/aidbox';

import { useEncounterList } from 'src/containers/EncounterList/hooks';

import { ModalNewEncounter } from '../ModalNewEncounter';
import { Table } from '../Table';

interface Props {
    patient: Patient;
}

const columns = [
    {
        title: <Trans>Practitioner</Trans>,
        dataIndex: 'practitioner',
        key: 'practitioner',
    },
    {
        title: <Trans>Status</Trans>,
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: <Trans>Appointment date</Trans>,
        dataIndex: 'date',
        key: 'date',
    },
];

export const PatientEncounter = ({ patient }: Props) => {
    const navigate = useNavigate();
    const { encounterDataListRD, reloadEncounter } = useEncounterList({ subject: patient.id });

    return (
        <>
            <div>
                <ModalNewEncounter patient={patient} reloadEncounter={reloadEncounter} />
            </div>
            <RenderRemoteData remoteData={encounterDataListRD}>
                {(tableData) => (
                    <Table
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
                                    navigate(`/encounters/${record.key}`);
                                },
                            };
                        }}
                    />
                )}
            </RenderRemoteData>
        </>
    );
};
