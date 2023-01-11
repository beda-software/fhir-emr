import { EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Col, Empty, Input, Row, Tag } from 'antd';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseLayout, BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalPractitioner } from 'src/components/ModalPractitioner';

import { PractitionerListRowData, usePractitionersList } from './hooks';
import s from './PractitionerList.module.scss';
import { Table } from 'src/components/Table';
import Title from 'antd/es/typography/Title';

export function PractitionerList() {
    const { practitionerDataListRD, practitionerListReload } = usePractitionersList();

    return (
        <BaseLayout>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Practitioners</Trans>
                        </Title>
                    </Col>
                    <Col>
                        <ModalPractitioner
                            key={'new'}
                            modalTitle="Add New Practitioner"
                            buttonText={t`Add New Practitioner`}
                            icon={<PlusOutlined />}
                            questionnaireId="practitioner-create"
                            buttonType="primary"
                            practitionerListReload={practitionerListReload}
                        />
                    </Col>
                </Row>
                <div className={s.searchBar}>
                    <Input.Search placeholder={t`Search by name`} style={{ width: 264 }} />
                    <Button>
                        <Trans>Reset</Trans>
                    </Button>
                </div>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <RenderRemoteData remoteData={practitionerDataListRD}>
                    {(tableData) => {
                        return (
                            <Table
                                bordered
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
                                columns={[
                                    {
                                        title: <Trans>Name</Trans>,
                                        dataIndex: 'practitionerName',
                                        key: 'practitionerName',
                                        width: '20%',
                                    },
                                    {
                                        title: <Trans>Speciality</Trans>,
                                        dataIndex: 'practitionerRoleList',
                                        key: 'practitionerRoleList',
                                        width: '30%',
                                        render: (tags: string[]) => (
                                            <>
                                                {tags.map((tag) => (
                                                    <Tag key={tag}>{tag}</Tag>
                                                ))}
                                            </>
                                        ),
                                    },
                                    {
                                        title: <Trans>Date</Trans>,
                                        dataIndex: 'practitionerCreatedDate',
                                        key: 'practitionerCreatedDate',
                                        width: '5%',
                                    },
                                    {
                                        title: <Trans>Actions</Trans>,
                                        dataIndex: 'practitionerResource',
                                        key: 'actions',
                                        width: '5%',
                                        render: (
                                            practitionerResource: any,
                                            rowData: PractitionerListRowData,
                                        ) => {
                                            const { practitionerRolesResource } = rowData;
                                            return (
                                                <>
                                                    <ModalPractitioner
                                                        key={'edit'}
                                                        modalTitle="Edit Practitioner"
                                                        buttonType="link"
                                                        buttonText={t`Edit`}
                                                        icon={<EditTwoTone />}
                                                        questionnaireId="practitioner-edit"
                                                        practitionerResource={practitionerResource}
                                                        practitionerRole={
                                                            practitionerRolesResource?.[0]
                                                        }
                                                        practitionerListReload={
                                                            practitionerListReload
                                                        }
                                                    />
                                                </>
                                            );
                                        },
                                    },
                                ]}
                            />
                        );
                    }}
                </RenderRemoteData>
            </BasePageContent>
        </BaseLayout>
    );
}
