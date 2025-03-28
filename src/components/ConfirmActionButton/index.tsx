import { Popconfirm } from 'antd';

interface Props {
    action: (T: any) => void;
    reload?: () => void;
    qrId?: string;
    title: string;
    children: any;
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
