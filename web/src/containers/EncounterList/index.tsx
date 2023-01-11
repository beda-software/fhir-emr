import { t, Trans } from '@lingui/macro';
import { Button, Col, DatePicker, Empty, Input, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseLayout, BasePageContent, BasePageHeader } from 'src/components/BaseLayout';

import { useEncounterList } from './hooks';
import { Table } from 'src/components/Table';
import Title from 'antd/es/typography/Title';
import { SearchBar } from 'src/components/SearchBar';

const columns = [
    {
        title: <Trans>Patient</Trans>,
        dataIndex: 'patient',
        key: 'patient',
    },
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

const { RangePicker } = DatePicker;

export function EncounterList() {
    const navigate = useNavigate();

    const { encounterDataListRD } = useEncounterList({});

    return (
        <BaseLayout>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Title style={{ marginBottom: 40 }}>
                    <Trans>Encounters</Trans>
                </Title>
                <SearchBar>
                    <Row gutter={32}>
                        <Col>
                            <Input.Search placeholder={t`Search by patient`} />
                        </Col>
                        <Col>
                            <Input.Search placeholder={t`Search by practitioner`} />
                        </Col>
                        <Col>
                            <RangePicker placeholder={[t`Start date`, t`End date`]} />
                        </Col>
                    </Row>

                    <Button type="primary">
                        <Trans>Reset</Trans>
                    </Button>
                </SearchBar>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <RenderRemoteData remoteData={encounterDataListRD}>
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
                                            navigate(`/encounters/${record.key}`);
                                        },
                                    };
                                }}
                            />
                        );
                    }}
                </RenderRemoteData>
            </BasePageContent>
        </BaseLayout>
    );
}
