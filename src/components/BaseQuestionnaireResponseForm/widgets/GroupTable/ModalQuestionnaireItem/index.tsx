import classNames from 'classnames';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Modal } from 'src/components';

import s from '../../../BaseQuestionnaireResponseForm.module.scss';
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
            <div className={classNames(s.content, 'form__content', s.form)}>
                <QuestionItems
                    questionItems={item!}
                    parentPath={[...parentPath, linkId, 'items', index.toString()]}
                    context={context[index]!}
                />
            </div>
        </Modal>
    );
}
