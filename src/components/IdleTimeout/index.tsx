import { t } from '@lingui/macro';
import { Button, Modal } from 'antd';

import { useIdleTimeout } from './hooks';

export function IdleTimeout() {
    const { state, recordProviderActivity, signOutNow } = useIdleTimeout();

    return (
        <Modal
            open={state === 'warning'}
            closable={false}
            maskClosable={false}
            keyboard={false}
            title={t`Your session is about to end`}
            footer={[
                <Button key="sign-out-now" onClick={signOutNow}>
                    {t`Sign out now`}
                </Button>,
                <Button key="stay-signed-in" type="primary" onClick={recordProviderActivity}>
                    {t`Stay signed in`}
                </Button>,
            ]}
        >
            {t`You've been inactive for a while. For your security, your session will end soon unless you stay signed in.`}
        </Modal>
    );
}
