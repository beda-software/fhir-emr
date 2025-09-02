import { Alert } from 'antd';

interface Props {
    message?: string;
    actionComponent?: React.ReactNode;
    type?: 'info' | 'success' | 'warning' | 'error';
    style?: React.CSSProperties;
}

export function AlertMessage(props: Props) {
    const { actionComponent, message, type = 'info', style = {} } = props;

    return (
        <>
            {!message ? null : (
                <Alert style={style} message={message} type={type} showIcon action={actionComponent} banner />
            )}
        </>
    );
}
