import { ModalProps as ANTDModalProps } from 'antd/lib/modal';

import { S } from './Modal.styles';

export type ModalProps = ANTDModalProps;

export function Modal(props: ModalProps) {
    return <S.Modal maskClosable={false} {...props} />;
}
