import { PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Alert, Button, Flex, Space, Switch, Table, Typography } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { useGroupTable } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/hooks';
import { ModalQuestionnaireItem } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/ModalQuestionnaireItem';

import { GroupTableChart } from './GroupTableChart';
import { S } from './styles';
import { RepeatableGroupTableRow } from './types';

export function GroupTable(props: GroupItemProps) {
    const {
        repeats,
        hidden,
        title,
        formValues,
        handleAdd,
        dataSource,
        columns,
        isModalVisible,
        editIndex,
        handleCancel,
        handleSave,
        snapshotDataSource,
        renderAsTable,
        handleRenderTypeToggle,
        chartLinkIdX,
        chartLinkIdY,
    } = useGroupTable(props);

    if (hidden) {
        return null;
    }

    return (
        <>
            <Flex justify="space-between">
                <Typography.Title level={4}>{title}</Typography.Title>
                <Space size={16}>
                    {handleRenderTypeToggle && (
                        <Space size="small">
                            <Switch checked={renderAsTable} onChange={handleRenderTypeToggle} />
                            <Typography.Text>{t`Table View`}</Typography.Text>
                        </Space>
                    )}
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>{t`Add entry`}</Button>
                </Space>
            </Flex>

            {repeats ? (
                formValues ? (
                    renderAsTable ? (
                        <S.Item>
                            <Table<RepeatableGroupTableRow>
                                columns={columns}
                                dataSource={snapshotDataSource ?? dataSource}
                                rowKey={(record) => {
                                    return record.key;
                                }}
                                pagination={false}
                                bordered
                            />
                        </S.Item>
                    ) : chartLinkIdX && chartLinkIdY ? (
                        <S.ChartItem>
                            <GroupTableChart
                                dataSource={snapshotDataSource ?? dataSource}
                                linkIdX={chartLinkIdX}
                                linkIdY={chartLinkIdY}
                            />
                        </S.ChartItem>
                    ) : (
                        <Alert type="error" message={t`linkIdX or linkIdY not defined`} />
                    )
                ) : (
                    <Alert type="error" message={t`Error getting form values`} />
                )
            ) : (
                <Alert
                    type="error"
                    message={t`This itemControl is designed for repeatable groups, but this group is not repeatable`}
                />
            )}

            <ModalQuestionnaireItem
                open={isModalVisible}
                index={editIndex}
                groupItem={props}
                title={title}
                handleCancel={handleCancel}
                handleSave={handleSave}
            />
        </>
    );
}
