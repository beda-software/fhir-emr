import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'develop',
    baseURL: 'http://localhost:8080',
    sdcIdeUrl: 'http://localhost:3001',
    aiQuestionnaireBuilderUrl: 'http://localhost:3002',

    webSentryDSN: null,
    mobileSentryDSN: null,

    jitsiMeetServer: 'localhost:8443',

    wearablesDataStreamService: 'http://localhost:8082/api/v1',

    metriportIdentifierSystem: 'https://api.sandbox.metriport.com',
};
