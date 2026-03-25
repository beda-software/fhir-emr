import { PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Alert, Button, Flex, Space, Switch, Table, Typography } from 'antd';

import { useGroupTable } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/hooks';
import { ModalQuestionnaireGroupItem } from 'src/components/ModalQuestionnaireGroupItem';

import { GroupTableChart } from './GroupTableChart';
import { S } from './styles';
import { GroupTableProps, GroupTableRow } from './types';

export function GroupTable(props: GroupTableProps) {
    const { chartHeight } = props;

    const {
        repeats,
        hidden,
        title,
        handleAdd,
        dataSource,
        columns,
        expandable,
        isModalVisible,
        editIndex,
        handleCancel,
        handleSave,
        snapshotDataSource,
        renderAsTable,
        handleRenderTypeToggle,
        chartLinkIdX,
        chartLinkIdY,
        chartYRange,
        chartHighlightAreas,
        hiddenItems,
    } = useGroupTable(props);

    if (hidden) {
        return null;
    }

    return (
        <>
            {hiddenItems}
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
                renderAsTable ? (
                    <S.TableWrapper>
                        <Table<GroupTableRow>
                            columns={columns}
                            dataSource={snapshotDataSource ?? dataSource}
                            rowKey={(record) => {
                                return record.key;
                            }}
                            pagination={false}
                            bordered
                            expandable={expandable}
                        />
                    </S.TableWrapper>
                ) : chartLinkIdX && chartLinkIdY ? (
                    <S.ChartItem $chartHeight={chartHeight}>
                        <GroupTableChart
                            dataSource={snapshotDataSource ?? dataSource}
                            linkIdX={chartLinkIdX}
                            linkIdY={chartLinkIdY}
                            chartYRange={chartYRange}
                            chartHighlightAreas={chartHighlightAreas}
                            {...props}
                        />
                    </S.ChartItem>
                ) : (
                    <Alert type="error" message={t`linkIdX or linkIdY not defined`} />
                )
            ) : (
                <Alert
                    type="error"
                    message={t`This itemControl is designed for repeatable groups, but this group is not repeatable`}
                />
            )}

            <ModalQuestionnaireGroupItem
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
