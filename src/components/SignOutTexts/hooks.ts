import { t } from '@lingui/macro';
import { useContext } from 'react';

import { SignOutTextsContext } from './context';

export function useSignOutTexts() {
    return useContext(SignOutTextsContext);
}

export function useForcedSignOutMessage() {
    return useSignOutTexts()?.forcedSignOutMessage ?? t`You were signed out because there was no activity for a while.`;
}

export function useExpiredSignOutMessage() {
    return useSignOutTexts()?.expiredSignOutMessage ?? t`Your session has expired. Please sign in again.`;
}
