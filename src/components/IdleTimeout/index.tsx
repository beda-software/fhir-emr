import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';

import { useSignOutTexts } from 'src/components/SignOutTexts';
import { getToken } from 'src/services/auth';

import { useIdleTimeout, useWarningWindowTexts } from './hooks';
import { IdleTimeoutConfig, IdleTimeoutProps, WarningWindowTexts } from './types';
import { registerMountedIdleTimeout, resolveIdleTimeoutConfig } from './utils';

export type { IdleTimeoutProps, WarningWindowTexts };

// Every sign-in and sign-out reloads the page, so the token seen at mount holds for its lifetime.
export function IdleTimeout(props: IdleTimeoutProps) {
    const [config] = useState(() => resolveIdleTimeoutConfig(props));
    const [isSignedIn] = useState(() => getToken() !== undefined);

    return isSignedIn ? <ActiveIdleTimeout config={config} /> : null;
}

function ActiveIdleTimeout({ config }: { config: IdleTimeoutConfig }) {
    useEffect(() => registerMountedIdleTimeout(config), [config]);
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
