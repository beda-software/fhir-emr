import { t, Trans } from '@lingui/macro';
import { PageHeader, Button, Table, Input, Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout, BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalNewPatient } from 'src/components/ModalNewPatient';

const columns: ColumnsType<Patient> = [
    {
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
        render: (_text, resource) => renderHumanName(resource.name?.[0]),
    },
    {
        title: <Trans>Birth date</Trans>,
        dataIndex: 'birthDate',
        key: 'birthDate',
        render: (_text, resource) => resource.birthDate,
    },
    {
        title: <Trans>SSN</Trans>,
        dataIndex: 'identifier',
        key: 'identifier',
        render: (_text, resource) => resource.identifier?.[0].value,
    },
    {
        title: <Trans>Actions</Trans>,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, resource) => {
            return (
                <Button type="link" block>
                    <Trans>Open</Trans>
                </Button>
            );
        },
    },
];

export function PatientList() {
    const [patientsResponse] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Patient>('Patient', {}),
            (bundle) => extractBundleResources(bundle).Patient,
        ),
    );

    const navigate = useNavigate();

    return (
        <BaseLayout>
            <BasePageHeader style={{ padding: '0 0 92px' }}>
                <PageHeader title={t`Patients`} extra={[<ModalNewPatient />]} />
                <div
                    style={{
                        position: 'relative',
                        padding: 16,
                        height: 64,
                        borderRadius: 10,
                        backgroundColor: '#C0D4FF',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Input.Search placeholder={t`Find patient`} style={{ width: 264 }} />
                    <Button>
                        <Trans>Reset</Trans>
                    </Button>
                </div>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <Table<Patient>
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
                    rowKey={(p) => p.id!}
                    dataSource={isSuccess(patientsResponse) ? patientsResponse.data : []}
                    columns={columns}
                    loading={isLoading(patientsResponse)}
                    onRow={(record) => {
                        return {
                            onClick: () =>
                                navigate(`/patients/${record.id}`, { state: { record } }),
                        };
                    }}
                />
            </BasePageContent>
        </BaseLayout>
    );
}
