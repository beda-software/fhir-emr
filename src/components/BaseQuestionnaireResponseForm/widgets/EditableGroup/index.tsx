import { t } from '@lingui/macro';
import { Alert, Button, Flex, Table, Typography } from 'antd';
import { GroupItemProps } from 'sdc-qrf';

import { GroupTableRow } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/types';
import { ModalQuestionnaireGroupItem } from 'src/components/ModalQuestionnaireGroupItem';

import { useEditableGroup } from './hooks';

export function EditableGroup(props: GroupItemProps) {
    const {
        repeats,
        readOnly,
        hidden,
        title,
        dataSource,
        dataColumns,
        isModalVisible,
        handleCancel,
        handleUpdate,
        handleSave,
        snapshotDataSource,
    } = useEditableGroup(props);

    if (hidden) {
        return null;
    }

    return (
        <>
            <Flex justify="space-between">
                <Typography.Title level={4}>{title}</Typography.Title>
                {readOnly ? null : <Button type="link" onClick={handleUpdate}>{t`Update`}</Button>}
            </Flex>

            {!repeats ? (
                <Table<GroupTableRow>
                    columns={dataColumns}
                    dataSource={snapshotDataSource ?? dataSource}
                    rowKey={(record) => {
                        return record.key;
                    }}
                    pagination={false}
                    bordered
                />
            ) : (
                <Alert type="error" message={t`This itemControl is designed for non-repeatable groups`} />
            )}

            <ModalQuestionnaireGroupItem
                open={isModalVisible}
                groupItem={props}
                title={title}
                index={0}
                handleCancel={handleCancel}
                handleSave={handleSave}
            />
        </>
    );
}
