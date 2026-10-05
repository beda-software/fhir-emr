import { Button, Modal } from 'antd';

import { useSignOutTexts } from 'src/components/SignOutTexts';

import { useIdleTimeout, useWarningWindowTexts } from './hooks';
import { IdleTimeoutConfig, WarningWindowTexts } from './types';
import { IDLE_TIMEOUT_CONFIG } from './utils';

export type { WarningWindowTexts };

export function IdleTimeout() {
    return IDLE_TIMEOUT_CONFIG ? <ActiveIdleTimeout config={IDLE_TIMEOUT_CONFIG} /> : null;
}

function ActiveIdleTimeout({ config }: { config: IdleTimeoutConfig }) {
    const { state, recordProviderActivity, signOutNow } = useIdleTimeout(config);
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
