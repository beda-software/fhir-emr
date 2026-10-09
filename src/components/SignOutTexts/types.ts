import type { WarningWindowTexts } from 'src/components/IdleTimeout/types';

// Any field left out falls back to fhir-emr's default, translated text.
export interface SignOutTexts {
    warningWindow?: WarningWindowTexts;
    forcedSignOutMessage?: string;
    expiredSignOutMessage?: string;
}
