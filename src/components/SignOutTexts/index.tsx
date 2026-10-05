import { t } from '@lingui/macro';
import { createContext, useContext } from 'react';

import type { WarningWindowTexts } from 'src/components/IdleTimeout/types';

// Any field left out falls back to fhir-emr's default, translated text.
export interface SignOutTexts {
    warningWindow?: WarningWindowTexts;
    forcedSignOutMessage?: string;
    expiredSignOutMessage?: string;
}

export const SignOutTextsContext = createContext<SignOutTexts | undefined>(undefined);

export function useSignOutTexts() {
    return useContext(SignOutTextsContext);
}

export function useForcedSignOutMessage() {
    return useSignOutTexts()?.forcedSignOutMessage ?? t`You were signed out because there was no activity for a while.`;
}

export function useExpiredSignOutMessage() {
    return useSignOutTexts()?.expiredSignOutMessage ?? t`Your session has expired. Please sign in again.`;
}
