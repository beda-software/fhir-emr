import classNames from 'classnames';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Modal } from 'src/components';
import s from 'src/components/BaseQuestionnaireResponseForm/BaseQuestionnaireResponseForm.module.scss';

interface ModalQuestionnaireItemProps {
    open: boolean;
    index?: number;
    groupItem: GroupItemProps;
    title?: string;
    handleCancel: () => void;
    handleSave: () => void;
}

export function ModalQuestionnaireGroupItem(props: ModalQuestionnaireItemProps) {
    const { open, index, groupItem, title, handleCancel, handleSave } = props;
    const { questionItem, parentPath, context } = groupItem;
    const { item, linkId } = questionItem;

    if (index === undefined) {
        return null;
    }

    const repeats = !!questionItem.repeats;

    const modalTitle = repeats ? `${title} ${index + 1}` : title;
    const modalParentPath = repeats
        ? [...parentPath, linkId, 'items', index.toString()]
        : [...parentPath, linkId, 'items'];

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
                <QuestionItems questionItems={item!} parentPath={[...modalParentPath]} context={context[index]!} />
            </div>
        </Modal>
    );
}
