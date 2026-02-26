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
};

export default config;
