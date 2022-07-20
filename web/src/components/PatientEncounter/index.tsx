import { Trans } from '@lingui/macro';
import { Empty, Table } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { useEncounterList } from 'src/containers/EncounterList/hooks';

interface Props {
    patientId: string;
}

const columns = [
    {
        title: 'Врач',
        dataIndex: 'practitioner',
        key: 'practitioner',
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Дата приема',
        dataIndex: 'date',
        key: 'date',
    },
];

export const PatientEncounter = ({ patientId }: Props) => {
    const navigate = useNavigate();
    const encounterDataListRD = useEncounterList({ subject: patientId });

    return (
        <div style={infoContainerStyle}>
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
