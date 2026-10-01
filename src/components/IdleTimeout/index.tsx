import { Button, Modal } from 'antd';

import { useSignOutTexts } from 'src/components/SignOutTexts';

import { useIdleTimeout, useWarningWindowTexts } from './hooks';
import { WarningWindowTexts } from './types';

export type { WarningWindowTexts };

export function IdleTimeout() {
    const { state, recordProviderActivity, signOutNow } = useIdleTimeout();
    const { title, body, stayLabel, signOutLabel } = useWarningWindowTexts(useSignOutTexts()?.warningWindow);

    return (
        <Modal
            open={state === 'warning'}
            closable={false}
            maskClosable={false}
            keyboard={false}
            title={title}
            footer={[
                <Button key="sign-out-now" onClick={signOutNow}>
                    {signOutLabel}
                </Button>,
                <Button key="stay-signed-in" type="primary" onClick={recordProviderActivity}>
                    {stayLabel}
                </Button>,
            ]}
        >
            {body}
        </Modal>
    );
}
