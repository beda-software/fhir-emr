import { t } from '@lingui/macro';
import { createContext, useContext } from 'react';

// Any field left out falls back to fhir-emr's default, translated text.
export interface SignOutTexts {
    expiredSignOutMessage?: string;
}

export const SignOutTextsContext = createContext<SignOutTexts | undefined>(undefined);

export function useSignOutTexts() {
    return useContext(SignOutTextsContext);
}

export function useExpiredSignOutMessage() {
    return useSignOutTexts()?.expiredSignOutMessage ?? t`Your session has expired. Please sign in again.`;
}
