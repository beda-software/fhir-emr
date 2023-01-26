import { EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Col, Empty, Row, Tag } from 'antd';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { Practitioner } from 'shared/src/contrib/aidbox';

import { BasePageContent, BasePageHeader } from 'src/components/BaseLayout';
import { ModalPractitioner } from 'src/components/ModalPractitioner';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { Table } from 'src/components/Table';

import { PractitionerListRowData, usePractitionersList } from './hooks';

export function PractitionerList() {
    const { practitionerDataListRD, practitionerListReload } = usePractitionersList();

    const { columnsFilterValues, filteredData, onChangeColumnFilter, onResetFilters } =
        useSearchBar<PractitionerListRowData>({
            columns: [
                {
                    id: 'practitioner',
                    type: 'string',
                    key: 'practitionerName',
                    placeholder: t`Search by name`,
                },
            ],
            data: isSuccess(practitionerDataListRD) ? practitionerDataListRD.data : [],
        });

    return (
        <>
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

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    filteredData={filteredData}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
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
                    dataSource={filteredData}
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
                            title: <Trans>Actions</Trans>,
                            dataIndex: 'practitionerResource',
                            key: 'actions',
                            width: '5%',
                            render: (
                                practitionerResource: Practitioner,
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
                                            practitionerRole={practitionerRolesResource?.[0]}
                                            practitionerListReload={practitionerListReload}
                                        />
                                        <div style={{ width: '8px' }} />
                                        <Link to={`${practitionerResource.id}/schedule`}>
                                            <span style={{ color: 'black' }}>Schedule</span>
                                        </Link>
                                    </>
                                );
                            },
                        },
                    ]}
                />
            </BasePageContent>
        </>
    );
}
