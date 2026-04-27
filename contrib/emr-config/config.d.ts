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
    aiAssistantServiceUrl: string;
    inactiveMapping?: Record<string, {
        searchField: string;
        statusField: string;
        value: any;
    }>;
    localesConfig?: LocalesConfig;
    defaultLocale?: string;
};

export default config;
