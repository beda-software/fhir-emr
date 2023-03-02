import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'production',
    baseURL: 'https://aidbox.emr.beda.software',
    sdcIdeUrl: 'https://sdc.beda.software',

    webSentryDSN: null,
    mobileSentryDSN: null,
    jitsiMeetServer: 'jitsi.fhir-emr.beda.software',
};
