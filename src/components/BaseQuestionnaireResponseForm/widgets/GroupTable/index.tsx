import { PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Alert, Button, Flex, Table, Typography } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { useGroupTable } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/hooks';
import { ModalQuestionnaireItem } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/ModalQuestionnaireItem';

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
    } = useGroupTable(props);

    if (hidden) {
        return null;
    }

    return (
        <>
            <Flex justify="space-between">
                <Typography.Title level={4}>{title}</Typography.Title>
                <Button type="default" icon={<PlusOutlined />} onClick={handleAdd}></Button>
            </Flex>

            {!repeats && (
                <Alert
                    type="error"
                    message={t`This itemControl is designed for repeatable groups, but this group is not repeatable`}
                />
            )}

            {repeats && formValues && (
                <S.Item>
                    <Table<RepeatableGroupTableRow>
                        columns={columns}
                        dataSource={snapshotDataSource ?? dataSource}
                        rowKey={(record) => {
                            return record['key'];
                        }}
                        pagination={false}
                        bordered
                    />
                </S.Item>
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
