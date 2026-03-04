import classNames from 'classnames';
import { QuestionItems } from 'sdc-qrf';

import { Modal } from 'src/components';
import s from 'src/components/BaseQuestionnaireResponseForm/BaseQuestionnaireResponseForm.module.scss';

import { useModalQuestionnaireGroupItem } from './hooks';
import { ModalQuestionnaireItemProps } from './types';

export function ModalQuestionnaireGroupItem(props: ModalQuestionnaireItemProps) {
    const { open, groupItem, handleCancel } = props;
    const { questionItem } = groupItem;
    const { item } = questionItem;

    const modalProps = useModalQuestionnaireGroupItem(props);

    if (!modalProps) {
        return null;
    }
    const { handleOk, itemContext, modalParentPath, modalTitle } = modalProps;

    return (
        <Modal title={modalTitle} open={open} onOk={handleOk} onCancel={handleCancel} destroyOnClose closable={false}>
            <div className={classNames(s.content, 'form__content', s.form)}>
                <QuestionItems questionItems={item!} parentPath={[...modalParentPath]} context={itemContext!} />
            </div>
        </Modal>
    );
}
