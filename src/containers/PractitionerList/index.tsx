import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Empty, notification } from 'antd';
import { Practitioner } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import { isLoading, isSuccess } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { usePractitionersList } from './hooks';
import { getPractitionerListSearchBarColumns } from './searchBarUtils';

export interface PractitionerListActionsProps {
    onSuccess: () => void;
}

function DefaultPractitionerListActions({ onSuccess }: PractitionerListActionsProps) {
    return (
        <ModalTrigger
            title={t`Create practitioner`}
            trigger={
                <Button icon={<PlusOutlined />} type="primary">
                    <span>
                        <Trans>Add new practitioner</Trans>
                    </span>
                </Button>
            }
        >
            {({ closeModal }) => (
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('practitioner-create')}
                    onCancel={closeModal}
                    onSuccess={() => {
                        onSuccess();
                        closeModal();
                    }}
                />
            )}
        </ModalTrigger>
    );
}

interface PractitionerListProps {
    PractitionerListActions?: typeof DefaultPractitionerListActions;
}

export function PractitionerList(props: PractitionerListProps) {
    const PractitionerListActions = props.PractitionerListActions
        ? props.PractitionerListActions
        : DefaultPractitionerListActions;

    const navigate = useNavigate();
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: getPractitionerListSearchBarColumns(),
    });

    const { practitionerDataListRD, practitionerListReload, pagination, handleTableChange } = usePractitionersList(
        columnsFilterValues as StringTypeColumnFilterValue[],
    );

    return (
        <PageContainer
            layoutVariant="with-table"
            title={<Trans>Practitioners</Trans>}
            titleRightElement={
                <PractitionerListActions
                    onSuccess={() => {
                        practitionerListReload();
                        notification.success({
                            message: t`Practitioner successfully created`,
                        });
                    }}
                />
            }
            headerContent={
                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
            }
        >
            <Table
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                locale={{
                    emptyText: (
                        <>
                            <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </>
                    ),
                }}
                dataSource={isSuccess(practitionerDataListRD) ? practitionerDataListRD.data : []}
                columns={[
                    {
                        title: <Trans>Name</Trans>,
                        dataIndex: 'practitionerName',
                        key: 'practitionerName',
                        width: '20%',
                    },
                    {
                        title: <Trans>Specialty</Trans>,
                        dataIndex: 'practitionerRoleList',
                        key: 'practitionerRoleList',
                        width: '30%',
                        render: (specialties: string[]) => specialties.join(', '),
                    },
                    {
                        title: <Trans>Actions</Trans>,
                        dataIndex: 'practitionerResource',
                        key: 'actions',
                        width: '5%',
                        render: (practitioner: Practitioner) => {
                            return (
                                <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={() =>
                                        navigate(`/practitioners/${practitioner.id}`, {
                                            state: { practitioner },
                                        })
                                    }
                                >
                                    <Trans>Open</Trans>
                                </Button>
                            );
                        },
                    },
                ]}
                loading={isLoading(practitionerDataListRD) && { indicator: SpinIndicator }}
            />
        </PageContainer>
    );
}
