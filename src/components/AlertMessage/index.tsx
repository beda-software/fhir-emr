import { Alert } from 'antd';

export function AlertMessage(props: { message?: string; actionComponent?: React.ReactNode }) {
    const { actionComponent, message } = props;

    return (
        <>
            {!message ? null : (
                <Alert
                    style={{ marginBottom: '20px' }}
                    message={message}
                    type="info"
                    showIcon
                    action={actionComponent}
                    closable
                    banner
                />
            )}
        </>
    );
}
