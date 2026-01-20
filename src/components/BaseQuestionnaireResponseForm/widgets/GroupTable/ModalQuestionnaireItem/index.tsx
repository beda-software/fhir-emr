import { Modal } from 'antd';
import { FormItems, GroupItemProps, QuestionItems } from 'sdc-qrf';

import { S } from './styles';

interface ModalQuestionnaireItemProps {
    isModalVisible: boolean;
    setIsModalVisible: (isModalVisible: boolean) => void;
    index: number | undefined;
    items: FormItems[];
    onChange: (...event: any[]) => void;
    groupItem: GroupItemProps;
    title?: string;
}

export function ModalQuestionnaireItem(props: ModalQuestionnaireItemProps) {
    const { isModalVisible, setIsModalVisible, index, items, onChange, groupItem, title } = props;
    const { questionItem, parentPath, context } = groupItem;
    const { item, linkId } = questionItem;

    if (index === undefined) {
        return null;
    }

    const modalTitle = `${title} ${index + 1}`;

    return (
        <Modal
            title={modalTitle}
            open={isModalVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            onOk={() => {
                setIsModalVisible(false);
                onChange({
                    items: [...items],
                });
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
