import { Button, Modal } from 'antd';

import { useIdleTimeout, useWarningWindowTexts } from './hooks';
import { WarningWindowTexts } from './types';

export type { WarningWindowTexts };

interface IdleTimeoutProps {
    texts?: WarningWindowTexts;
}

export function IdleTimeout({ texts }: IdleTimeoutProps) {
    const { state, recordProviderActivity, signOutNow } = useIdleTimeout();
    const { title, body, stayLabel, signOutLabel } = useWarningWindowTexts(texts);

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
