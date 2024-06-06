import { ModalProps } from 'antd/lib/modal';
import { useCallback } from 'react';
import * as React from 'react';

import { Modal } from '../Modal';

interface Props {
    trigger: React.ReactElement<any>;
    children: (props: { closeModal: () => void }) => React.ReactNode | string;
    title: React.ReactNode;
    onSubmit?: (values?: any) => Promise<any>;
    onCancel?: () => void;
    modalProps?: ModalProps;
}

function useModalTrigger(props: Props) {
    const [showModal, setShowModal] = React.useState(false);
    const closeModal = useCallback(() => setShowModal(false), []);
    const onCancel = useCallback(() => {
        if (props.onCancel) {
            props.onCancel();
        }

        closeModal();
    }, [props, closeModal]);

    const onSubmit = useCallback(async () => {
        if (props.onSubmit) {
            await props.onSubmit();
        }

        closeModal();
    }, [props, closeModal]);

    return { onCancel, closeModal, showModal, setShowModal, onSubmit };
}

export function ModalTrigger(props: Props) {
    const { children, title, trigger } = props;
    const { onCancel, showModal, setShowModal, onSubmit, closeModal } = useModalTrigger(props);

    const defaultModalProps = { footer: null, destroyOnClose: true };
    const modalProps = { ...defaultModalProps, ...props.modalProps };

    return (
        <>
            {React.cloneElement(trigger, {
                onClick: () => {
                    setShowModal(true);
                },
            })}
            <Modal open={showModal} title={title} onCancel={onCancel} onOk={onSubmit} {...modalProps}>
                {showModal && children({ closeModal })}
            </Modal>
        </>
    );
}
