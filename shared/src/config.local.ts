import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'develop',
    baseURL: 'http://localhost:8080',
    sdcIdeUrl: 'http://localhost:3001',
    aiQuestionnaireBuilderUrl: 'https://builder.emr.beda.software',

    webSentryDSN: null,
    mobileSentryDSN: null,

    jitsiMeetServer: 'http://localhost:8443',

    wearablesDataStreamService: 'http://localhost:8082',
};
