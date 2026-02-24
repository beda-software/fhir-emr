import type { ColumnsType } from 'antd/es/table/interface';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItems, GroupItemProps, RepeatableFormGroupItems } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { RenderFormItemReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/RenderFormItemReadOnly';
import { GroupTableItem, GroupTableRow } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/types';
import { getDataSource } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/utils';

export function useEditableGroup(props: GroupItemProps) {
    const { parentPath, questionItem } = props;
    const { linkId, repeats, text, hidden, item } = questionItem;

    const title = text ? text : linkId;
    const readOnly = !!questionItem.readOnly;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    const { onChange } = useFieldController<RepeatableFormGroupItems>(fieldName, questionItem);

    const { getValues, reset } = useFormContext<FormItems>();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [snapshotFormValues, setSnapshotFormValues] = useState<FormItems[] | null>(null);
    const [snapshotDataSource, setSnapshotDataSource] = useState<GroupTableRow[] | null>(null);

    const fullFormValues = getValues();
    const formValues = _.get(getValues(), fieldName);

    const visibleItem = useMemo(() => item?.filter((i) => !i.hidden && i.type !== 'display'), [item]);

    const formItems: FormItems[] = useMemo(() => {
        return [formValues?.items] || [];
    }, [formValues]);

    const fields = useMemo(() => _.map(visibleItem, (item) => item.linkId), [visibleItem]);

    const dataSource: GroupTableRow[] = useMemo(() => {
        return getDataSource(fields, formItems, questionItem);
    }, [fields, formItems, questionItem]);

    const startEdit = useCallback(() => {
        setSnapshotFormValues(_.cloneDeep(formValues));
        setSnapshotDataSource(_.cloneDeep(dataSource));
    }, [dataSource, formValues]);

    const handleUpdate = useCallback(() => {
        startEdit();
        setIsModalVisible(true);
    }, [startEdit]);

    const handleCancel = useCallback(() => {
        const currentFullFormValues = _.cloneDeep(getValues());
        _.set(currentFullFormValues, fieldName, _.cloneDeep(snapshotFormValues));
        reset(currentFullFormValues, { keepDirty: true });
        onChange({ items: snapshotFormValues });
        setSnapshotFormValues(null);
        setSnapshotDataSource(null);
        setIsModalVisible(false);
    }, [fieldName, getValues, onChange, reset, snapshotFormValues]);

    const handleSave = useCallback(() => {
        setSnapshotFormValues(null);
        setSnapshotDataSource(null);
        reset(fullFormValues, { keepDirty: true });
        setIsModalVisible(false);
    }, [fullFormValues, reset]);

    const dataColumns: ColumnsType<GroupTableRow> = useMemo(() => {
        return _.map(visibleItem, (questionItem) => {
            return {
                title: questionItem.text ? questionItem.text : questionItem.linkId,
                dataIndex: questionItem.linkId,
                key: questionItem.linkId,
                render: (value: GroupTableItem) => (
                    <RenderFormItemReadOnly formItem={value.formItem} questionnaireItem={value.questionnaireItem} />
                ),
            };
        });
    }, [visibleItem]);

    return {
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
    };
}
