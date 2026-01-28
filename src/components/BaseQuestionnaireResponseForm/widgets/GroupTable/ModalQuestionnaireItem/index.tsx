import { Modal } from 'antd';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { S } from './styles';

interface ModalQuestionnaireItemProps {
    open: boolean;
    index: number | undefined;
    groupItem: GroupItemProps;
    title?: string;
    handleCancel: () => void;
    handleSave: () => void;
}

export function ModalQuestionnaireItem(props: ModalQuestionnaireItemProps) {
    const { open, index, groupItem, title, handleCancel, handleSave } = props;
    const { questionItem, parentPath, context } = groupItem;
    const { item, linkId } = questionItem;

    if (index === undefined) {
        return null;
    }

    const modalTitle = `${title} ${index + 1}`;

    return (
        <Modal
            title={modalTitle}
            open={open}
            onOk={() => {
                handleSave();
            }}
            onCancel={() => {
                handleCancel();
            }}
            destroyOnClose
            closable={false}
        >
            <S.GroupContent>
                <QuestionItems
                    questionItems={item!}
                    parentPath={[...parentPath, linkId, 'items', index.toString()]}
                    context={context[index]!}
                />
            </S.GroupContent>
        </Modal>
    );
}
