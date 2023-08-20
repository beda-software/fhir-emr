import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'production',
    baseURL: 'https://aidbox.emr.beda.software',
    sdcIdeUrl: 'https://sdc.beda.software',
    aiQuestionnaireBuilderUrl: 'https://builder.emr.beda.software',

    webSentryDSN: null,
    mobileSentryDSN: null,
    jitsiMeetServer: 'video.emr.beda.software/',
    wearablesDataStreamService: 'https://ingest.emr.beda.software',
    metriportIdentifierSystem: 'https://api.sandbox.metriport.com',
};
