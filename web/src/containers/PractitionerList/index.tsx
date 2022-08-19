import { t, Trans } from '@lingui/macro';
import { PageHeader, Button, Table, Input, Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient, Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout } from 'src/components/BaseLayout';
import { ModalNewPractitioner } from 'src/components/ModalNewPractitioner';

import { usePractitionersList } from './hooks';

const dataSource = [
    {
        key: '1',
        fullname: 'Волыхов Андрей Александрович',
        specialty: 'Хирург',
        position: 'Заведующий отделением, практикующий врач',
        date: '12.12.2021',
    },
    {
        key: '2',
        fullname: 'Вассерман Анатолий Александрович',
        specialty: 'Оториноларинголог',
        position: 'Главный врач, практикующий врач',
        date: '12.12.2021',
    },
];

const columns = [
    {
        title: <Trans>Name</Trans>,
        dataIndex: 'practitionerName',
        key: 'practitionerName',
        width: '35%',
    },
    {
        title: <Trans>Speciality</Trans>,
        dataIndex: 'practitionerRoleList',
        key: 'practitionerRoleList',
        width: '20%',
    },
    {
        title: <Trans>Date</Trans>,
        dataIndex: 'practitionerCreatedDate',
        key: 'practitionerCreatedDate',
        width: '25%',
    },
    // {
    //     title: <Trans>Appointment date</Trans>,
    //     dataIndex: 'date',
    //     key: 'date',
    // },
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
];

export function PractitionerList() {
    const navigate = useNavigate();

    const practitionersDataListRD = usePractitionersList();

    return (
        <BaseLayout bgHeight={281}>
            <PageHeader title={t`Practitioners`} extra={[<ModalNewPractitioner />]} />
            <div
                style={{
                    position: 'relative',
                    padding: 16,
                    height: 64,
                    borderRadius: 10,
                    backgroundColor: '#C0D4FF',
                    marginBottom: 36,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Input.Search placeholder={t`Search by name`} style={{ width: 264 }} />
                <Button>
                    <Trans>Reset</Trans>
                </Button>
            </div>
            <RenderRemoteData remoteData={practitionersDataListRD}>
                {(tableData) => {
                    return (
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
                                        navigate(`/practitioners/${record.id}`, {
                                            state: { record },
                                        });
                                    },
                                };
                            }}
                        />
                    );
                }}
            </RenderRemoteData>
        </BaseLayout>
    );
}
