import { Modal as ANTDModal } from 'antd';
import { ModalProps as ANTDModalProps } from 'antd/lib/modal';

import s from './Modal.module.scss';

export interface ModalProps extends ANTDModalProps {}

export function Modal(props: ModalProps) {
    return <ANTDModal className={s.modal} {...props} />;
}
