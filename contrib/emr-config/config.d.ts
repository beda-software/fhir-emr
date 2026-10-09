import type { Messages } from '@lingui/core';
import type { Locale as AntdLocale } from 'antd/es/locale';

export interface LocaleData {
    label: string;
    messages: Messages;
    antdLocale: AntdLocale;
}

export type LocalesConfig = Record<string, LocaleData>;

declare const config: {
    clientId: string;
    /**
     * Sign-in flow. `'implicit'` (default) or `'code'`, the authorization code flow with PKCE.
     * `'code'` requires `authTokenPath` and `authClientRedirectURL`.
     */
    authFlow?: 'implicit' | 'code';
    authTokenPath?: string;
    authClientRedirectURL?: string;

    wearablesAccessConsentCodingSystem: string;

    tier: string;
    baseURL: string;
    fhirBaseURL?: string;
    sdcIdeUrl: string;

    sdcBackendUrl: string | null;
    webSentryDSN: string | null;
    mobileSentryDSN: string | null;
    jitsiMeetServer: string;
    wearablesDataStreamService: string;
    metriportIdentifierSystem: string;
    aiAssistantServiceUrl?: string | null;
    bedaFormsUrl?: string | null;
    inactiveMapping?: Record<string, {
        searchField: string;
        statusField: string;
        value: any;
    }>;
    localesConfig?: LocalesConfig;
    defaultLocale?: string;

    /**
     * Idle Timeout duration in milliseconds: how long a Session may go without
     * Provider Activity before it's ended. The Idle Timeout is disabled when omitted or `null`.
     */
    idleTimeoutMs?: number | null;
    /**
     * How long before the Idle Timeout the warning is shown. Defaults to 2 minutes.
     * Ignored while the Idle Timeout is disabled.
     */
    warningWindowBeforeIdleTimeoutMs?: number | null;
};

export default config;
