const config = {
    clientId: 'web',

    wearablesAccessConsentCodingSystem: 'https://fhir.emr.beda.software/CodeSystem/consent-subject',

    tier: 'develop',
    baseURL: 'http://localhost:8080',
    sdcIdeUrl: 'http://localhost:3001',
    sdcBackendUrl: null,

    webSentryDSN: null,
    mobileSentryDSN: null,

    jitsiMeetServer: 'localhost:8443',

    wearablesDataStreamService: 'http://localhost:8082/api/v1',

    metriportIdentifierSystem: 'https://api.sandbox.metriport.com',
    aiAssistantServiceUrl: 'http://localhost:3002/',
};

export { config as default };
