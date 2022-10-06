import { Trans } from '@lingui/macro';
import { Empty, Table } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Patient } from 'shared/src/contrib/aidbox';

import { useEncounterList } from 'src/containers/EncounterList/hooks';

import { ModalNewEncounter } from '../ModalNewEncounter';

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
        <div style={infoContainerStyle}>
            <ModalNewEncounter patient={patient} reloadEncounter={reloadEncounter} />
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
        </div>
    );
};

const infoContainerStyle = {
    width: 1080,
    backgroundColor: '#ffffff',
    padding: '32px 40px',
    boxShadow: '0px 6px 16px #E6EBF5',
    marginTop: 54,
};
