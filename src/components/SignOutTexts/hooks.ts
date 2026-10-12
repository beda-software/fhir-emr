import { t } from '@lingui/macro';
import { useContext } from 'react';

import { SignOutTextsContext } from './context';

export function useSignOutTexts() {
    return useContext(SignOutTextsContext);
}

export function useExpiredSignOutMessage() {
    return useSignOutTexts()?.expiredSignOutMessage ?? t`Your session has expired. Please sign in again.`;
}
