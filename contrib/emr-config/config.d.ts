declare const config: {
    clientId: string;

    authType?: 'token' | 'code'; // Default: token

    // authTokenPath and authClientRedirectURL are used for `code` authType
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
};

export default config;
