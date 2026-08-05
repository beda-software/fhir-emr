import { Popconfirm } from 'antd';
import { ReactNode } from 'react';

interface Props {
    action: (qrId: string) => void | Promise<void>;
    reload?: () => void;
    qrId?: string;
    title: string;
    children: ReactNode;
    okText: string;
    cancelText: string;
}

export const ConfirmActionButton = ({ action, reload, qrId, title, children, okText, cancelText }: Props) => {
    const handleConfirm = async () => {
        if (qrId) {
            await action(qrId);
            if (reload) {
                reload();
            }
        }
    };

    return (
        <Popconfirm title={title} okText={okText} cancelText={cancelText} onConfirm={handleConfirm}>
            {children}
        </Popconfirm>
    );
};
