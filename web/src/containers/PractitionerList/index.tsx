import { EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { PageHeader, Button, Table, Input, Empty, Tag } from 'antd';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BaseLayout } from 'src/components/BaseLayout';
import { ModalNewPractitioner } from 'src/components/ModalNewPractitioner';

import { PractitionerListRowData, usePractitionersList } from './hooks';
import s from './PractitionerList.module.scss';

const columns = [
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
        render: (practitionerResource: any, rowData: PractitionerListRowData) => {
            const { practitionerRoleList, practitionerRolesResource } = rowData;
            return (
                <>
                    <ModalNewPractitioner
                        modalTitle="Edit Practitioner"
                        buttonType="link"
                        buttonText={t`Edit`}
                        icon={<EditTwoTone />}
                        questionnaire="practitioner-edit"
                        practitionerResource={practitionerResource}
                        practitionerRoleList={practitionerRoleList}
                        practitionerRolesResource={practitionerRolesResource}
                    />
                </>
            );
        },
    },
];

export function PractitionerList() {
    const practitionersDataListRD = usePractitionersList();

    return (
        <BaseLayout bgHeight={281}>
            <div className={s.tableSectionContainer}>
                <PageHeader
                    title={t`Practitioners`}
                    extra={[
                        <ModalNewPractitioner
                            modalTitle="Add New Practitioner"
                            buttonText={t`Add New Practitioner`}
                            icon={<PlusOutlined />}
                            buttonType="primary"
                            questionnaire="practitioner-create"
                        />,
                    ]}
                />
                <div className={s.searchBar}>
                    <Input.Search placeholder={t`Search by name`} style={{ width: 264 }} />
                    <Button>
                        <Trans>Reset</Trans>
                    </Button>
                </div>

                <RenderRemoteData remoteData={practitionersDataListRD}>
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
                                    columns={columns}
                                />
                            </div>
                        );
                    }}
                </RenderRemoteData>
            </div>
        </BaseLayout>
    );
}
