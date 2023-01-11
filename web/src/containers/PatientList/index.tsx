import { t, Trans } from '@lingui/macro';
import { Button, Input, Empty, Row, Col } from 'antd';
import Title from 'antd/es/typography/Title';
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
import { Table } from 'src/components/Table';
import { formatHumanDate } from 'src/utils/date';

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
        render: (_text, resource) =>
            resource.birthDate ? formatHumanDate(resource.birthDate) : null,
        width: '25%',
    },
    {
        title: <Trans>SSN</Trans>,
        dataIndex: 'identifier',
        key: 'identifier',
        render: (_text, resource) => resource.identifier?.[0].value,
        width: '25%',
    },
    {
        title: <Trans>Actions</Trans>,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, resource) => {
            return (
                <Button type="link" style={{ padding: 0 }}>
                    <Trans>Open</Trans>
                </Button>
            );
        },
        width: 200,
    },
];

export function PatientList() {
    const [patientsResponse, manager] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Patient>('Patient', {}),
            (bundle) => extractBundleResources(bundle).Patient,
        ),
    );

    const navigate = useNavigate();

    return (
        <BaseLayout>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Patients</Trans>
                        </Title>
                    </Col>
                    <Col>
                        <ModalNewPatient onCreate={manager.reload} />
                    </Col>
                </Row>
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
