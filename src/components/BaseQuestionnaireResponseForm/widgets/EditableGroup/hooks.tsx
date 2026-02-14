import type { ColumnsType } from 'antd/es/table/interface';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItems, GroupItemProps, RepeatableFormGroupItems } from 'sdc-qrf';
import { getItemKey } from 'sdc-qrf/dist/utils';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { RenderFormItemReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/RenderFormItemReadOnly';

import { EditableGroupTableItem, EditableGroupTableRow } from './types';

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
    const [snapshotDataSource, setSnapshotDataSource] = useState<EditableGroupTableRow[] | null>(null);

    const fullFormValues = getValues();
    const formValues = _.get(getValues(), fieldName);

    const visibleItem = useMemo(() => item?.filter((i) => !i.hidden), [item]);

    const formItems: FormItems = useMemo(() => {
        return formValues?.items || [];
    }, [formValues]);

    const fields = useMemo(
        () =>
            _.map(visibleItem, (item) => {
                return item.linkId;
            }),
        [visibleItem],
    );

    const dataSource: EditableGroupTableRow[] = useMemo(() => {
        if (fields.length === 0) {
            return [];
        }

        const data: EditableGroupTableRow = fields.reduce((acc: EditableGroupTableRow, curr: string) => {
            const questionnaireItem = questionItem.item?.find((qItem) => qItem.linkId === curr);

            acc[curr] = {
                ...(curr in formItems
                    ? { formItem: formItems[curr], questionnaireItem: questionnaireItem ?? undefined }
                    : {}),
                linkId: curr,
            };

            return acc;
        }, {} as EditableGroupTableRow);
        data.key = getItemKey(formItems);
        return [data];
    }, [fields, formItems, questionItem.item]);

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

    const dataColumns: ColumnsType<EditableGroupTableRow> = useMemo(() => {
        return _.map(visibleItem, (questionItem) => {
            return {
                title: questionItem.text ? questionItem.text : questionItem.linkId,
                dataIndex: questionItem.linkId,
                key: questionItem.linkId,
                render: (value: EditableGroupTableItem) => (
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
