import { ModalProps as ANTDModalProps } from 'antd/lib/modal';

import { S } from './Modal.styles';

export interface ModalProps extends ANTDModalProps {}

export function Modal(props: ModalProps) {
    return <S.Modal maskClosable={false} {...props} />;
}
