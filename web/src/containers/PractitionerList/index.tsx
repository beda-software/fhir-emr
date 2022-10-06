import { EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Empty, Input, PageHeader, Table, Tag } from 'antd';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseLayout } from 'src/components/BaseLayout';
import { ModalPractitioner } from 'src/components/ModalPractitioner';

import { PractitionerListRowData, usePractitionersList } from './hooks';
import s from './PractitionerList.module.scss';

export function PractitionerList() {
    const { practitionerDataListRD, practitionerListReload } = usePractitionersList();

    return (
        <BaseLayout bgHeight={281}>
            <div className={s.tableSectionContainer}>
                <PageHeader
                    title={t`Practitioners`}
                    extra={[
                        <ModalPractitioner
                            key={'new'}
                            modalTitle="Add New Practitioner"
                            buttonText={t`Add New Practitioner`}
                            icon={<PlusOutlined />}
                            questionnaireId="practitioner-create"
                            buttonType="primary"
                            practitionerListReload={practitionerListReload}
                        />,
                    ]}
                />
                <div className={s.searchBar}>
                    <Input.Search placeholder={t`Search by name`} style={{ width: 264 }} />
                    <Button>
                        <Trans>Reset</Trans>
                    </Button>
                </div>

                <RenderRemoteData remoteData={practitionerDataListRD}>
                    {(tableData) => {
                        return (
                            <div className={s.tableContainer}>
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
                                                            practitionerResource={
                                                                practitionerResource
                                                            }
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
                            </div>
                        );
                    }}
                </RenderRemoteData>
            </div>
        </BaseLayout>
    );
}
